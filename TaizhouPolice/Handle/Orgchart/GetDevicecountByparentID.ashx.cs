using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace TaizhouPolice.Handle.Orgchart
{
    /// <summary>
    /// GetDevicecountByparentID 的摘要说明
    /// </summary>
    public class GetDevicecountByparentID : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            SqlParameter[] sp = new SqlParameter[1];
            sp[0] = new SqlParameter("@id", context.Request.Form["ID"]);

            //WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=1 UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM [Entity] A,childtable b where a.[ParentID] = b.[ID]) SELECT [DevType],COUNT(id) FROM [Device] as de where de.EntityId in (select ID from  childtable) group by DevType 
            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=@id UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM [Entity] A,childtable b where a.[ParentID] = b.[ID]) SELECT [DevType],COUNT(id) as sum FROM [Device] as de where de.EntityId in (select ID from  childtable) group by DevType ", "entity",sp);
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