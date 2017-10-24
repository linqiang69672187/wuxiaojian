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
    /// GetUsers 的摘要说明
    /// </summary>
    public class GetUsers : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string search = context.Request.Form["search"];
            string ssdd = context.Request.Form["ssdd"];
            string sszd = context.Request.Form["sszd"];

            StringBuilder sqltext = new StringBuilder();
             //所有大队
            if (ssdd == "all")
            {
                sqltext.Append("SELECT ro.RoleName,ad.[ID],[UserName],[Password],[EntityId],[Tel],[RoleId],et.Name,et2.Name as parentname FROM Admin  ad left join Entity et on  ad.EntityId = et.ID left join Entity et2 on et.ParentID = et2.ID left join Role ro on ro.ID = ad.RoleId  where  UserName like '%" + search + "%'");
            }


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