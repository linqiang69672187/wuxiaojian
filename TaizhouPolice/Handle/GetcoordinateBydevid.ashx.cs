using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;

namespace TaizhouPolice.Handle
{
    /// <summary>
    /// GetcoordinateBydevid 的摘要说明
    /// </summary>
    public class GetcoordinateBydevid : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string devid = context.Request.Form["devid"];
       

            StringBuilder sqltext = new StringBuilder();

            sqltext.Append("SELECT top 1 [Lo],[La] FROM [Gps] where PDAID ='" + devid + "'");
        

            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");

            context.Response.Write(JSON.DatatableToDatatableJS(dt, ""));
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