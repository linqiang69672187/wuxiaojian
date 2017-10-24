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
    public class GetDevicesStatusbak : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            SqlParameter[] sp = new SqlParameter[1];
            sp[0] = new SqlParameter("@id", context.Request.Form["ID"]);
            DataTable dt = SQLHelper.ExecuteReadStrProc(CommandType.StoredProcedure, "GetdevicesbyParentID", "GPS", sp);


            DataView dataView = dt.DefaultView;
            DataTable ConDistinct = dataView.ToTable(true, "Contacts");//注：其中ToTable（）的第一个参数为是否DISTINCT 人员不同
           
            
            string[] devices = { "1", "2", "3", "4", "5" };
            //1.车载视频  2.对讲机 3.拦截仪 4.警务通 5.执法记录仪 //1正常 2.小于2小时  3.小于四小时 4.故障
            int[,] status = new int[5, 4] { { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } };


            StringBuilder jsoncontacts = new StringBuilder();
            jsoncontacts.Append("[");
            for (int i = 0; i < ConDistinct.Rows.Count; i++)
            {
                if (i != 0) { jsoncontacts.Append(","); };
                jsoncontacts.Append("{");
                jsoncontacts.Append("\"Contacts\":\"" + ConDistinct.Rows[i]["Contacts"].ToString() + "\"");
                jsoncontacts.Append("}");
            }
            jsoncontacts.Append("]");
           

            //1正常 2.小于2小时  3.小于四小时 4.故障

            for (int i = 0; i < devices.Length; i++)
            {
                for (int h = 0; h < dt.Rows.Count; h++)
                {
                    if (dt.Rows[h]["DevType"].ToString() != devices[i]) { continue; }
                  
                        if (dt.Rows[h]["IsOnline"].ToString() == "1")
                            {
                                status[i,0] += 1;
                                continue;
                            }
                            else
                            {
                                try
                                {
                                    int offlinetime = Convert.ToInt16(dt.Rows[h]["ContinueOffllineTime"].ToString());
                                    if (offlinetime > 240*60) { status[i,3] += 1; continue; }
                                    if (offlinetime < 240 * 60 && offlinetime > 120 * 60) { status[i, 2] += 1; continue; }
                                    if (offlinetime < 120 * 60) { status[i, 1] += 1; continue; }
                                    
                                }
                                catch (Exception ex) { status[i, 3] += 1; }
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

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}