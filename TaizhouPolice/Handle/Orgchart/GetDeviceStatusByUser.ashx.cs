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
    /// GetDeviceStatusByUser 的摘要说明
    /// </summary>
    public class GetDeviceStatusByUser : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            SqlParameter[] sp = new SqlParameter[1];
            sp[0] = new SqlParameter("@name", context.Request.Form["name"]);
            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, "select de.DevId, DE.[DevType],DE.Contacts,gp.[OnlineTime],gp.HandleCnt,al.CommonAlarmGate,al.UrgencyAlarmGate,al.AlarmType  from Device as de LEFT JOIN EverydayInfo as gp on de.DevId=gp.DevId left join AlarmGate al on al.DevType = de.DevType where  DATEDIFF(d,gp.Time,GETDATE()) = 1 and de.Contacts = @name", "status", sp);

            string[] devices = { "1", "2", "3", "4", "5" };
            //1.车载视频  2.对讲机 3.拦截仪 4.警务通 5.执法记录仪 //1正常 2.小于2小时  3.小于四小时 4.故障
              //1正常 2.小于2小时  3.小于四小时 4.故障

            string isnormal = "";
            string status = "";
            StringBuilder json = new StringBuilder();
            json.Append("[");
            for (int i = 0; i < devices.Length; i++)
            {
           
              isnormal = "";
         
          
                for (int n = 0; n < dt.Rows.Count; n++)
                {

                    if (devices[i].ToString() == dt.Rows[n]["DevType"].ToString()) //设备唯一匹配
                    {

                        if (dt.Rows[n]["OnlineTime"].ToString() == "0")
                        {
                            status = (i == 0) ? "\"故障\"" : ",\"故障\"";
                           // status[i, 3] += 1;//灰：表示在线时长为0
                            goto nextdevice;

                        }
                        if (dt.Rows[n]["AlarmType"].ToString() == "2") //处理量
                        {
                            if (Convert.ToInt32(dt.Rows[n]["UrgencyAlarmGate"].ToString()) > Convert.ToInt32(dt.Rows[n]["HandleCnt"].ToString()))
                            {
                                status = (i == 0) ? "\"紧急告警\"" : ",\"紧急告警\"";
                           
                              //  status[i, 2] += 1; //红：紧急告警。有一个指标紧急告警就红色

                                goto nextdevice;
                            }
                            if (Convert.ToInt32(dt.Rows[n]["CommonAlarmGate"].ToString()) > Convert.ToInt32(dt.Rows[n]["HandleCnt"].ToString()))
                            {
                                isnormal = "1";//黄：一般告警。至少有一个指标告警，且都没到紧急告警。
                            }



                        }
                        else //目前在线时长
                        {
                            if (Convert.ToInt32(dt.Rows[n]["UrgencyAlarmGate"].ToString()) * 60 * 60 > Convert.ToInt32(dt.Rows[n]["OnlineTime"].ToString()))
                            {
                                status = (i == 0) ? "\"紧急告警\"" : ",\"紧急告警\"";
                               // status[i, 2] += 1; //红：紧急告警。有一个指标紧急告警就红色
                                goto nextdevice;
                            }
                            if (Convert.ToInt32(dt.Rows[n]["CommonAlarmGate"].ToString()) * 60 * 60 > Convert.ToInt32(dt.Rows[n]["OnlineTime"].ToString()))
                            {
                                status = (i == 0) ? "\"一般告警\"" : ",\"一般告警\"";
                               // status[i, 1] += 1; //黄：一般告警。至少有一个指标告警，且都没到紧急告警。
                                goto nextdevice;
                            }

                        }
                        if (isnormal == "1")
                        {
                            status = (i == 0) ? "\"一般告警\"" : ",\"一般告警\"";
                            //status[i, 1] += 1;    //黄：一般告警。至少有一个指标告警，且都没到紧急告警。
                            goto nextdevice;
                        }
                        else
                        {
                            status = (i == 0) ? "\"正常\"" : ",\"正常\"";
                           // status[i, 0] += 1; //黄：全都正常
                            goto nextdevice;
                        }


                    }
                    status = (i == 0) ? "\"0\"" : ",\"0\"";


                nextdevice:
                    continue;

                }



                //string status = "\"0\"";
                //if (i != 0)
                //{
                //    json.Append(",");
                //}
                //for (int h = 0; h < dt.Rows.Count; h++)
                //{
                //    if (dt.Rows[h]["DevType"].ToString() != devices[i]) { continue; }
                //    if (dt.Rows[h]["IsOnline"].ToString() == "1")
                //    {
                //        status = "\"正常\"";
                //        continue;
                //    }
                //    else
                //    {
                //        try
                //        {
                //            int offlinetime = Convert.ToInt16(dt.Rows[h]["ContinueOffllineTime"].ToString());
                //            if (offlinetime > 240 * 60) { status="\"故障\""; continue; }
                //            if (offlinetime < 240 * 60 && offlinetime > 120 * 60) { status = "\"小于4小时\""; continue; }
                //            if (offlinetime < 120 * 60) { status = "\"小于2小时\""; continue; }

                //        }
                //        catch (Exception ex) { status= "\"故障\""; }
                //        finally
                //        {
                          
                           
                //        }
                //    }    
                //}
                json.Append(status);
            }
            json.Append("]");

            context.Response.Write(json.ToString());

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