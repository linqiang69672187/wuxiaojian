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
    /// GetManageEntitys 的摘要说明
    /// </summary>
    public class GetManageEntitys : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string search = context.Request.Form["search"];
            string ssdd = context.Request.Form["ssdd"];
  

            StringBuilder sqltext = new StringBuilder();
            //所有大队
            if (ssdd == "all")
            {
                if (search == "") {
                    sqltext.Append("SELECT [id], [Name],[ParentID],[JGDM],[Sort],[FullName],[UserCount]  FROM [Entity] order by Depth, Sort");
                }
                else
                {
                    sqltext.Append("SELECT [id],[Name],[ParentID],[JGDM],[Sort],[FullName],[UserCount]  FROM [Entity]   where  Name like '%" + search + "%'  order by Depth, Sort");
                }
            }
            else
            {
                 if (search == "") {
                     sqltext.Append("SELECT [id], [Name],[ParentID],[JGDM],[Sort] ,[FullName],[UserCount]  FROM [Entity]  where  [ParentID] ='" + ssdd + "'  order by Depth, Sort");
                  }
                  else
                  {
                      sqltext.Append("SELECT  [id],[Name],[ParentID],[JGDM],[Sort] ,[FullName],[UserCount] FROM [Entity]   where [ParentID] ='" + ssdd + "' and  Name like '%" + search + "%'  order by Sort");
                  }
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