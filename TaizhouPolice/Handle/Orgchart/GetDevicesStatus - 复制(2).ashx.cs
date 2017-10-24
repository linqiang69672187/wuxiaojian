using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;

namespace TaizhouPolice.Handle.Orgchart
{
    /// <summary>
    /// GetDevicesStatus 的摘要说明
    /// </summary>
    public class GetDevicesStatusx : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            StringBuilder jsoncontacts = new StringBuilder();
            if (context.Request.Form["ID"] == null)
            {
                jsoncontacts.Append("[]");
            }
            else
            {
                SqlParameter[] sp1 = new SqlParameter[1];
                sp1[0] = new SqlParameter("@id", context.Request.Form["ID"]);

                DataTable ConDistinct = SQLHelper.ExecuteReadStrProc(CommandType.StoredProcedure, "GetcontactsyParentID", "GPS", sp1);

              
                jsoncontacts.Append("[");
                for (int i = 0; i < ConDistinct.Rows.Count; i++)
                {
                    if (i != 0) { jsoncontacts.Append(","); };
                    jsoncontacts.Append("{");
                    jsoncontacts.Append("\"Contacts\":\"" + ConDistinct.Rows[i]["Contacts"].ToString() + "\"");
                    jsoncontacts.Append("}");
                }
                jsoncontacts.Append("]");
            }

            DataTable dt;
            if (context.Request.Form["ID"] == null)
            {

                dt = SQLHelper.ExecuteRead(CommandType.Text, "  select de.DevId, DE.[DevType],DE.Contacts,gp.[OnlineTime],gp.HandleCnt,gp.Time,al.CommonAlarmGate,al.UrgencyAlarmGate,al.AlarmType  from Device as de LEFT JOIN EverydayInfo as gp on de.DevId=gp.DevId left join AlarmGate al on al.DevType = de.DevType where de.[Contacts]='" + context.Request.Form["name"] + "' and DATEDIFF(d,gp.Time,GETDATE()) = 1 ", "GPS");

            }
            else
            {
                SqlParameter[] sp = new SqlParameter[1];
                sp[0] = new SqlParameter("@id", context.Request.Form["ID"]);
                dt= SQLHelper.ExecuteReadStrProc(CommandType.StoredProcedure, "GetdevicesbyParentID", "GPS", sp);

            }
       
            DataView dataView = dt.DefaultView;
            
            
            DataTable DevDistinct = dataView.ToTable(true, "DevId");//注：其中ToTable（）的第一个参数为是否DISTINCT 人员不同

            
            string[] devices = { "1", "2", "3", "4", "5" };
            //1.车载视频  2.对讲机 3.拦截仪 4.警务通 5.执法记录仪 //1正常 2.小于2小时  3.小于四小时 4.故障
            int[,] status = new int[5, 4] { { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } };
            
             DataTable Devstatus; //设备状态
             DataView dv = dt.DefaultView;
          
          


           
           
            string isnormal="";
            //1正常 2.小于2小时  3.小于四小时 4.故障

            for (int i = 0; i < devices.Length; i++)
            {
             
                for (int h = 0; h < DevDistinct.Rows.Count; h++)
                {


                    dv.RowFilter = "DevId='" + DevDistinct.Rows[h]["DevId"].ToString() + "' and DevType='" + devices[i] + "'";
                    Devstatus = dv.ToTable();
                    if (Devstatus.Rows.Count == 0)  continue;
                    isnormal = "正常";
                    for (int n = 0; n < Devstatus.Rows.Count; n++)
                    {

                         if (Devstatus.Rows[n]["OnlineTime"].ToString() == "0")
                            {
                                status[i, 3] += 1;//故障：表示在线时长为0
                                goto nextdevice;

                            }

                         if (Devstatus.Rows[n]["AlarmType"].ToString() == "2") //处理量
                         {

                             if (Convert.ToInt16(Devstatus.Rows[n]["CommonAlarmGate"].ToString()) > Convert.ToInt32(Devstatus.Rows[n]["HandleCnt"].ToString()) && isnormal == "正常")
                             {
                                 isnormal = "一般告警";//黄：一般告警。至少有一个指标告警，且都没到紧急告警。
                             }

                             if (Convert.ToInt32(Devstatus.Rows[n]["UrgencyAlarmGate"].ToString()) > Convert.ToInt32(Devstatus.Rows[n]["HandleCnt"].ToString()))
                             {
                                 isnormal = "紧急告警"; //红：紧急告警。有一个指标紧急告警就红色
                             }


                         }
                         else
                         {

                             if (Convert.ToInt32(Devstatus.Rows[n]["UrgencyAlarmGate"].ToString()) * 60 * 60 > Convert.ToInt32(Devstatus.Rows[n]["OnlineTime"].ToString()))
                                {
                                    isnormal = "紧急告警"; //红：紧急告警。有一个指标紧急告警就红色
                  
                                }
                             if (Convert.ToInt32(Devstatus.Rows[n]["CommonAlarmGate"].ToString()) * 60 * 60 > Convert.ToInt32(Devstatus.Rows[n]["OnlineTime"].ToString()) && isnormal == "正常")
                                {
                                    isnormal = "一般告警";//黄：一般告警。至少有一个指标告警，且都没到紧急告警。
                               
                                }
                         }





                    }

                    switch (isnormal)
                    {
                        case "一般告警":
                             status[i, 1] += 1; //红：紧急告警。有一个指标紧急告警就红色
                            break;

                        case "紧急告警":
                             status[i, 2] += 1; //红：紧急告警。有一个指标紧急告警就红色
                            break;

                        case "正常":
                            status[i, 0] += 1; //红：紧急告警。有一个指标紧急告警就红色
                            break;
                        default:

                             
                            break;


                    }

                    /**
                    isnormal = "";
            
                    for (int n = 0; n < dt.Rows.Count; n++)
                    {

                        if (DevDistinct.Rows[h]["DevId"].ToString() == dt.Rows[n]["DevId"].ToString() && dt.Rows[n]["DevType"].ToString() == devices[i]) //设备唯一匹配
                        {

                            if (dt.Rows[n]["OnlineTime"].ToString() == "0")
                            {
                                status[i, 3] += 1;//灰：表示在线时长为0
                                h += 1;
                                goto nextdevice;

                            }
                            if (dt.Rows[n]["AlarmType"].ToString() == "2") //处理量
                            {
                                if (Convert.ToInt32(dt.Rows[n]["UrgencyAlarmGate"].ToString()) > Convert.ToInt32(dt.Rows[n]["HandleCnt"].ToString()))
                                     {
                                           status[i, 2] += 1; //红：紧急告警。有一个指标紧急告警就红色
                                           goto nextdevice;
                                      }
                                if (Convert.ToInt16(dt.Rows[n]["CommonAlarmGate"].ToString()) > Convert.ToInt32(dt.Rows[n]["HandleCnt"].ToString()))
                                {
                                    isnormal = "1";//黄：一般告警。至少有一个指标告警，且都没到紧急告警。
                                }
                             


                            }
                            else //目前在线时长
                            {
                                if (Convert.ToInt32(dt.Rows[n]["UrgencyAlarmGate"].ToString()) * 60 * 60 > Convert.ToInt32(dt.Rows[n]["OnlineTime"].ToString()))
                                {
                                    status[i, 2] += 1; //红：紧急告警。有一个指标紧急告警就红色
                                    goto nextdevice;
                                }
                                if (Convert.ToInt32(dt.Rows[n]["CommonAlarmGate"].ToString()) * 60 * 60 > Convert.ToInt32(dt.Rows[n]["OnlineTime"].ToString()))
                                {
                                    status[i, 1] += 1; //黄：一般告警。至少有一个指标告警，且都没到紧急告警。
                                    goto nextdevice; 
                                }

                            }
                            if (isnormal == "1")
                            {
                                status[i, 1] += 1;    //黄：一般告警。至少有一个指标告警，且都没到紧急告警。
                                goto nextdevice; 
                            }
                            else
                            {
                                status[i, 0] += 1; //黄：全都正常
                                goto nextdevice; 
                            }


                        }
                        **/





                nextdevice: ;
                
                }
                



                    //tape=dt.Rows[h]["DevType"].ToString();

                    //if (tape != devices[i] && tape != "4") { continue; }

                    //if (dt.Rows[h]["AlarmType"].ToString() == "2") //处理量指标
                    //{

                    //    if (Convert.ToInt16(dt.Rows[h]["UrgencyAlarmGate"].ToString()) > Convert.ToInt16(dt.Rows[h]["HandleCnt"].ToString()))
                    //    {
                    //        status[i, 0] += 1;
                    //        continue;
                    //    }
                    //}
                    //else  //其它指标
                    //{

                    //}

                    
                    //   if (dt.Rows[h]["IsOnline"].ToString() == "1")
                    //        {
                    //            status[i,0] += 1;
                    //            continue;
                    //        }
                    //        else
                    //        {
                    //            try
                    //            {
                    //                int offlinetime = Convert.ToInt16(dt.Rows[h]["ContinueOffllineTime"].ToString());
                    //                if (offlinetime > 240*60) { status[i,3] += 1; continue; }
                    //                if (offlinetime < 240 * 60 && offlinetime > 120 * 60) { status[i, 2] += 1; continue; }
                    //                if (offlinetime < 120 * 60) { status[i, 1] += 1; continue; }
                                    
                    //            }
                    //            catch (Exception ex) { status[i, 3] += 1; }
                    //         }  

                     
               
                }


     

            StringBuilder json = new StringBuilder();
            for (int i = 0; i < status.GetLength(0); i++)
            {
                   if (i != 0) { json.Append(","); };
                
                    json.Append("[");

          
            
                for (int j = 0; j < status.GetLength(1); j++)
                {
                    if (j != 0) { json.Append(","); };
                    json.Append(status[i,j]);

                }
                json.Append("]");
            }



            context.Response.Write("{\"r\":0,\"result\":[" + json.ToString() + "],\"contacts\":" + jsoncontacts.ToString() + "}");
            
        
        }

        public  DataTable SortDataTable(DataTable dt, string strExpr, string strSort, int mode)
        {
            switch (mode)
            {
                case 1:
                    //方法一　直接用DefaultView按条件返回 
                    dt.DefaultView.RowFilter = strExpr;
                    dt.DefaultView.Sort = strSort;
                    return dt;
                case 2:
                    //方法二　DataTable筛选，排序返回符合条件行组成的新DataTable 
                    DataTable dt1 = new DataTable();
                    DataRow[] GetRows = dt.Select(strExpr, strSort);
                    //复制DataTable dt结构不包含数据 
                    dt1 = dt.Clone();
                    foreach (DataRow row in GetRows)
                    {
                        dt1.Rows.Add(row.ItemArray);
                    }
                    return dt1;
                default:
                    return dt;
            }
        } 


        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}