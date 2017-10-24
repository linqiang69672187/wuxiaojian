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
    /// GetRole 的摘要说明
    /// </summary>
    public class GetRole : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            StringBuilder sqltext = new StringBuilder();
            if (context.Request.Form["search"]=="")
            { 
            sqltext.Append("SELECT  ID, RoleName, Power, Status, CreateDate, bz FROM   Role ");
            }
            else
            {
               sqltext.Append("SELECT  ID, RoleName, Power, Status, CreateDate, bz FROM   Role where RoleName like '%" + context.Request.Form["search"] + "'%");

            }

            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "contacts");

            context.Response.Write(JSON.DatatableToDatatableJS(dt,"role"));

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