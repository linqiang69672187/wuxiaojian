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
    /// EditAlarmGate 的摘要说明
    /// </summary>
    public class EditAlarmGate : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            SqlParameter[] sp = new SqlParameter[3];
            sp[0] = new SqlParameter("@ID", context.Request.Form["ID"]);
            sp[1] = new SqlParameter("@CommonAlarmGate", context.Request.Form["CommonAlarmGate"]);
            sp[2] = new SqlParameter("@UrgencyAlarmGate", context.Request.Form["UrgencyAlarmGate"]);

            StringBuilder sbSQL = new StringBuilder();



            sbSQL.Append("UPDATE  [AlarmGate] set [CommonAlarmGate]=@CommonAlarmGate,[UrgencyAlarmGate]=@UrgencyAlarmGate where [ID]=@ID");
            SQLHelper.ExecuteNonQuery(CommandType.Text, sbSQL.ToString(), sp);
            context.Response.Write("{\"result\":\"修改成功\",\"r\":\"0\"}");
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