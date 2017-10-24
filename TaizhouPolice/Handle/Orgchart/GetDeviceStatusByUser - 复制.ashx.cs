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
    public class GetDeviceStatusByUserbak : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            SqlParameter[] sp = new SqlParameter[1];
            sp[0] = new SqlParameter("@name", context.Request.Form["name"]);
            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, "SELECT de.[DevType],gps.[ContinueOffllineTime],gps.[IsOnline] FROM  [Device] as de Left Join [Gps] as gps on de.DevId = gps.PDAID where de.Contacts = @name ", "status", sp);

            string[] devices = { "1", "2", "3", "4", "5" };
            //1.车载视频  2.对讲机 3.拦截仪 4.警务通 5.执法记录仪 //1正常 2.小于2小时  3.小于四小时 4.故障
              //1正常 2.小于2小时  3.小于四小时 4.故障


            StringBuilder json = new StringBuilder();
            json.Append("[");
            for (int i = 0; i < devices.Length; i++)
            {
                string status = "\"0\"";
                if (i != 0)
                {
                    json.Append(",");
                }
                for (int h = 0; h < dt.Rows.Count; h++)
                {
                    if (dt.Rows[h]["DevType"].ToString() != devices[i]) { continue; }
                    if (dt.Rows[h]["IsOnline"].ToString() == "1")
                    {
                        status = "\"正常\"";
                        continue;
                    }
                    else
                    {
                        try
                        {
                            int offlinetime = Convert.ToInt16(dt.Rows[h]["ContinueOffllineTime"].ToString());
                            if (offlinetime > 240 * 60) { status="\"故障\""; continue; }
                            if (offlinetime < 240 * 60 && offlinetime > 120 * 60) { status = "\"小于4小时\""; continue; }
                            if (offlinetime < 120 * 60) { status = "\"小于2小时\""; continue; }

                        }
                        catch (Exception ex) { status= "\"故障\""; }
                        finally
                        {
                          
                           
                        }
                    }    
                }
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