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
    /// AddEditRole 的摘要说明
    /// </summary>
    public class AddEditRole : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            SqlParameter[] sp = new SqlParameter[4];
            sp[0] = new SqlParameter("@qxname", context.Request.Form["qxname"]);
            sp[1] = new SqlParameter("@power", context.Request.Form["power"]);
            sp[2] = new SqlParameter("@bz", context.Request.Form["bz"]);
            sp[3] = new SqlParameter("@id", context.Request.Form["id"]);
 

            StringBuilder sbSQL = new StringBuilder();

            switch (context.Request.Form["type"])
            {
                case "新增权限":
                    goto add;

                case "修改权限":
                    goto edit;


                case "删除权限":
                    goto del;

            }

        add:

            sbSQL.Append("INSERT INTO [Role] ([RoleName],[Power],[Status],[bz]) VALUES (@qxname, @power,1,@bz)");
            SQLHelper.ExecuteNonQuery(CommandType.Text, sbSQL.ToString(), sp);
            context.Response.Write("{\"result\":\"添加成功\",\"r\":\"0\"}");
            goto end;


        edit:
            sbSQL.Append("UPDATE  [Role] set [RoleName]=@qxname,[Power]=@power,[bz]=@bz where [ID]=@id");
            SQLHelper.ExecuteNonQuery(CommandType.Text, sbSQL.ToString(), sp);
            context.Response.Write("{\"result\":\"修改成功\",\"r\":\"0\"}");
            goto end;

        del:
            sbSQL.Append("delete  [Role]  where [ID]='" + context.Request.Form["ID"] + "'");
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