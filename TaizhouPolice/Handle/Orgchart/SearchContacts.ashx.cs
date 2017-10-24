using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace TaizhouPolice.Handle.Orgchart
{
    /// <summary>
    /// SearchContacts 的摘要说明
    /// </summary>
    public class SearchContacts : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, "SELECT distinct Contacts,EntityId   FROM  [Device] where Contacts like '%" + context.Request.Form["name"] + "%' ", "contacts");
            context.Response.Write(JSON.DatatableToJson(dt, ""));
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