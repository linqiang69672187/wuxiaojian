using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace TaizhouPolice.Handle.Orgchart
{
    /// <summary>
    /// GetEntitys 的摘要说明
    /// </summary>
    public class GetEntitys : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, "SELECT [ID], [Name],[ParentID],[PicUrl],[Depth]    FROM  [Entity] ", "entity");
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