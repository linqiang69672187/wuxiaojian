using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;

namespace TaizhouPolice.Handle
{
    /// <summary>
    /// AddGPS 的摘要说明
    /// </summary>
    public class AddGPS : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            StringBuilder sqltext = new StringBuilder();
            //所有大队

            sqltext.Append("SELECT [DevId] FROM [JingWuTong].[dbo].[Device] where DevId not in (SELECT [PDAID] FROM [Gps]) and DevType in (1,2,4)");
            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");

            for (int i = 0; i < dt.Rows.Count; i++)
            {

                SQLHelper.ExecuteNonQuery(CommandType.Text, "INSERT INTO [Gps] ([PDAID],[Lo],[La],[OnlineTime],[HandleCnt],[ContinueOnlineTime],[ContinueOffllineTime],[IsOnline]) VALUES(@id,0,0,0,0,0,0,0)", new SqlParameter("id", dt.Rows[i][0].ToString()));
            }
            context.Response.Write("GPS写入成功");

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