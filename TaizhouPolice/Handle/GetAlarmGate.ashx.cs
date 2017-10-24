using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace TaizhouPolice.Handle
{
    /// <summary>
    /// GetAlarmGate 的摘要说明
    /// </summary>
    public class GetAlarmGate : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, "SELECT al.ID,[DevType],[AlarmType],[CommonAlarmGate],[UrgencyAlarmGate],[TypeName] FROM [AlarmGate] al left join [AlarmType] at on at.Id = al.AlarmType  ", "entity");
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