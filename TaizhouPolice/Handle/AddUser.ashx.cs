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
    /// AddUser 的摘要说明
    /// </summary>
    public class AddUser : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            SqlParameter[] sp = new SqlParameter[5];
            sp[0] = new SqlParameter("@UserName", context.Request.Form["UserName"]);
            sp[1] = new SqlParameter("@Password", context.Request.Form["Password"]);
            sp[2] = new SqlParameter("@EntityId", context.Request.Form["EntityId"]);
            sp[3] = new SqlParameter("@Tel", context.Request.Form["Tel"]);
            sp[4] = new SqlParameter("@RoleId", context.Request.Form["RoleId"]);
       

            StringBuilder sbSQL = new StringBuilder();

            switch (context.Request.Form["addoredit"])
            {
                case "新增用户":
                    goto add;

                case "修改用户":
                    goto edit;


                case "删除用户":
                    goto del;

            }

        add:

            sbSQL.Append("INSERT INTO [Admin]([UserName],[Password],[EntityId],[Tel],[RoleId]) VALUES(@UserName,@Password,@EntityId,@Tel,@RoleId)");
            SQLHelper.ExecuteNonQuery(CommandType.Text, sbSQL.ToString(), sp);
            context.Response.Write("{\"result\":\"添加成功\",\"r\":\"0\"}");
            goto end;


        edit:
            sbSQL.Append("UPDATE  [Admin] set [Password]=@Password,[EntityId]=@EntityId,[Tel]=@Tel,[RoleId]=@RoleId where [UserName] = @UserName");
            SQLHelper.ExecuteNonQuery(CommandType.Text, sbSQL.ToString(), sp);
            context.Response.Write("{\"result\":\"修改成功\",\"r\":\"0\"}");
            goto end;

        del:
            sbSQL.Append("delete  [Admin]  where [ID]='" + context.Request.Form["ID"] + "'");
            SQLHelper.ExecuteNonQuery(CommandType.Text, sbSQL.ToString());
            context.Response.Write("{\"result\":\"删除成功\",\"r\":\"0\"}");
            goto end;

        end:
            context.Response.Write("");
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