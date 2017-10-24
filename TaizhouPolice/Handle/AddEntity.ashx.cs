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
    /// AddEntity 的摘要说明
    /// </summary>
    public class AddEntity : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            // 'Name': _Name, 'ParentID': _ParentID, 'FullName': _FullName, 'JGDM': _JGDM, 'Sort': _Sort, 'addoredit': _type
            SqlParameter[] sp = new SqlParameter[6];
            sp[0] = new SqlParameter("@Name", context.Request.Form["Name"]);
            sp[1] = new SqlParameter("@ParentID", context.Request.Form["ParentID"]);
            sp[2] = new SqlParameter("@FullName", context.Request.Form["FullName"]);
            sp[3] = new SqlParameter("@JGDM", context.Request.Form["JGDM"]);
            sp[4] = new SqlParameter("@Sort", context.Request.Form["Sort"]);
            sp[5] = new SqlParameter("@UserCount", context.Request.Form["tjusercount"]);

            StringBuilder sbSQL = new StringBuilder();

            switch (context.Request.Form["addoredit"])
            {
                case "新增单位":
                    goto add;

                case "修改单位":
                    goto edit;


                case "删除单位":
                    goto del;

            }

        add:
            if (context.Request.Form["ParentID"] == "1")
            {
                sbSQL.Append("INSERT INTO [Entity]([Name],[ParentID],[FullName],[JGDM],[Sort],[Depth],[UserCount]) VALUES(@Name,@ParentID,@FullName,@JGDM,@Sort,2,@UserCount)");
            }
            else
            {
                sbSQL.Append("INSERT INTO [Entity]([Name],[ParentID],[FullName],[JGDM],[Sort],[Depth],[UserCount]) VALUES(@Name,@ParentID,@FullName,@JGDM,@Sort,3,@UserCount)");
            }
           
            SQLHelper.ExecuteNonQuery(CommandType.Text, sbSQL.ToString(), sp);
            context.Response.Write("{\"result\":\"添加成功\",\"r\":\"0\"}");
            goto end;


        edit:
            if (context.Request.Form["ParentID"] == "1")
            {
                sbSQL.Append("UPDATE  [Entity] set [Name]=@Name,[ParentID]=@ParentID,[FullName]=@FullName,[JGDM]=@JGDM,[Sort]=@Sort,[Depth]=2,[UserCount]=@UserCount where [ID]=" + context.Request.Form["tjid"]);
            }
            else
            {
                sbSQL.Append("UPDATE  [Entity] set [Name]=@Name,[ParentID]=@ParentID,[FullName]=@FullName,[JGDM]=@JGDM,[Sort]=@Sort,[Depth]=3,[UserCount]=@UserCount where [ID]=" + context.Request.Form["tjid"]);
            }
            SQLHelper.ExecuteNonQuery(CommandType.Text, sbSQL.ToString(), sp);
            context.Response.Write("{\"result\":\"修改成功\",\"r\":\"0\"}");
            goto end;

        del:
            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, "select [ID]  from [Entity] where [ParentID] =@ID", "Et", new SqlParameter("Id", context.Request.Form["ID"]));
          //  dt = SQLHelper.ExecuteRead(CommandType.Text, "select [ID]  from [Device] where [DevId] =@DevId", "phone", new SqlParameter("DevId", context.Request.Form["deviceNo"]));
            if (dt.Rows.Count >0)
            {

                context.Response.Write("{\"result\":\"删除失败：该单位存在子单位\",\"r\":\"1\"}");
                return;
            }
            sbSQL.Append("delete  [Entity]  where [ID]='" + context.Request.Form["ID"] + "'");
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