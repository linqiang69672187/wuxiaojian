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
    public class GetDevicesStatus : IHttpHandler
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
                //以上联系人列表
            }

            DataTable dt;
            if (context.Request.Form["ID"] != null)
            {
                if (context.Request.Form["ID"] == "1")
                {
                    dt = SQLHelper.ExecuteRead(CommandType.Text, "select COUNT(id) as value,AlarmState,DevType   from  [Alarm_EveryDayInfo] where [AlarmType] in (1,4) and  DATEDIFF(d,[AlarmDay],GETDATE()) = 1  group by AlarmState,DevType order by DevType, AlarmState", "GPS");
                }
                else
                {
                    dt = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + context.Request.Form["ID"] + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM [Entity] A,childtable b where a.[ParentID] = b.[ID]) select  COUNT(gp.id) as value,AlarmState,de.DevType   from Device as de LEFT JOIN [Alarm_EveryDayInfo] as gp on de.DevId=gp.DevId  where [AlarmType] in (1,4) and  DATEDIFF(d,[AlarmDay],GETDATE()) = 1 and de.[EntityId]  in  (select ID from  childtable)  group by AlarmState,de.DevType order by de.DevType, AlarmState", "GPS");

                }
            }
            else
            {//这个是选中个人列表显示设备查看统计
                dt = SQLHelper.ExecuteRead(CommandType.Text, "select COUNT(gp.id) as value,AlarmState,gp.DevType   from  [Alarm_EveryDayInfo] as gp  LEFT JOIN Device as de on de.DevId=gp.DevId  where [AlarmType] in (1,4) and  DATEDIFF(d,[AlarmDay],GETDATE()) = 1 and de.[Contacts]='" + context.Request.Form["name"] + "'  group by AlarmState,gp.DevType order by gp.DevType, AlarmState", "GPS");

            }

            DataTable Devstatus; //设备状态
            DataView dv = dt.DefaultView;
          


            string[] devices = { "1", "2", "3", "4", "5" };
            //1.车载视频  2.对讲机 3.拦截仪 4.警务通 5.执法记录仪 //1正常 2.小于2小时  3.小于四小时 4.故障
            int[,] status = new int[5, 2] { { 0, 0 }, { 0, 0 }, { 0, 0 }, { 0, 0 }, { 0, 0 } };
      
           
            //1正常 2.小于2小时  3.小于四小时 4.故障

            for (int i = 0; i < devices.Length; i++)
            {             
                    dv.RowFilter = " DevType='" + devices[i] + "'";
                    Devstatus = dv.ToTable();
                    for (int n = 0; n < Devstatus.Rows.Count; n++)
                    {
                        if (Devstatus.Rows[n]["AlarmState"].ToString() == "1")
                        {
                            status[i, 1] = Convert.ToInt32(Devstatus.Rows[n]["value"].ToString());//告警                     

                        }
                        else
                        {
                            status[i, 0] = Convert.ToInt32(Devstatus.Rows[n]["value"].ToString());//正常    
                        }


                    }
                
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