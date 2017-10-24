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
    /// AddDevice 的摘要说明
    /// </summary>
    public class AddDevice : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            SqlParameter[] sp = new SqlParameter[11];
            sp[0] = new SqlParameter("@DevId", context.Request.Form["deviceNo"]);
            sp[1] = new SqlParameter("@EntityId", context.Request.Form["sszd"]);
            sp[2] = new SqlParameter("@Contacts", context.Request.Form["contacts"]);
            sp[3] = new SqlParameter("@Tel", context.Request.Form["telephone"]);
            sp[4] = new SqlParameter("@PlateNumber", context.Request.Form["Car"]);
            sp[5] = new SqlParameter("@DevType", context.Request.Form["adddeviceType"]);
            sp[6] = new SqlParameter("@addszCartype", context.Request.Form["addszCartype"]);
            sp[7] = new SqlParameter("@IdentityNum", context.Request.Form["IdentityNum"]);
            sp[8] = new SqlParameter("@SIMID", context.Request.Form["SIMID"]);
            sp[9] = new SqlParameter("@IMEI", context.Request.Form["IMEI"]);
            sp[10] = new SqlParameter("@IdentityPosition", context.Request.Form["IdentityPosition"]);

            StringBuilder sbSQL = new StringBuilder();
            DataTable dt;
            switch (context.Request.Form["addoredit"])
            {
                case "新增设备":
                    goto add;
                    
                case "修改设备":
                    goto edit;
                    

                case "删除设备":
                    goto del;
                    
            }

            add:
            //dt = SQLHelper.ExecuteRead(CommandType.Text, "select [ID]  from [Device] where [Contacts] =@Contacts and DevType=@DevType and [Contacts]<>''", "Contactsin", new SqlParameter("Contacts", context.Request.Form["Contacts"]), new SqlParameter("DevType", context.Request.Form["adddeviceType"]));
            //if (dt.Rows.Count == 1)
            //{

            //    context.Response.Write("{\"result\":\"该用户已存在同类型设备\",\"r\":\"1\"}");
            //    return;
            //}

             dt = SQLHelper.ExecuteRead(CommandType.Text, "select [ID]  from [Device] where [DevId] =@DevId", "phone", new SqlParameter("DevId", context.Request.Form["deviceNo"]));
            if (dt.Rows.Count > 0 )
            {
                
                context.Response.Write("{\"result\":\"编号已存在，请更换\",\"r\":\"1\"}");
                return;
            }
            sbSQL.Append("INSERT INTO  [Device] ([EntityId],[DevType],[DevId],[PlateNumber],[Contacts],[Tel1],[Cartype],[UserNum],[SIMID],[IdentityNum],[IMEI],[IdentityPosition]) VALUES ( @EntityId,@DevType,@DevId,@PlateNumber,@Contacts,@Tel,@addszCartype,@PlateNumber,@SIMID,@IdentityNum,@IMEI,@IdentityPosition) ");
            SQLHelper.ExecuteNonQuery(CommandType.Text, sbSQL.ToString(), sp);
            context.Response.Write("{\"result\":\"添加成功\",\"r\":\"0\"}");
            goto end;


             edit:
            //dt = SQLHelper.ExecuteRead(CommandType.Text, "select [ID]  from [Device] where [Contacts] =@Contacts and DevType=@DevType and [Contacts]<>'' and DevId <>@DevId", "Contactsin", new SqlParameter("Contacts", context.Request.Form["Contacts"]), new SqlParameter("DevType", context.Request.Form["adddeviceType"]), new SqlParameter("DevId", context.Request.Form["deviceNo"]));
            //if (dt.Rows.Count == 1)
            //{

            //    context.Response.Write("{\"result\":\"该用户已存在同类型设备\",\"r\":\"1\"}");
            //    return;
            //}

            sbSQL.Append("UPDATE  [Device] set [EntityId]=@EntityId,[DevType]=@DevType,[PlateNumber]=@PlateNumber,[Contacts]=@Contacts,[Tel1]=@Tel,[Cartype]=@addszCartype,[UserNum]=@PlateNumber,[SIMID]=@SIMID,[IdentityNum]=@IdentityNum,[IMEI]=@IMEI,[IdentityPosition]=@IdentityPosition where [DevId]=@DevId");
             SQLHelper.ExecuteNonQuery(CommandType.Text, sbSQL.ToString(), sp);
            context.Response.Write("{\"result\":\"修改成功\",\"r\":\"0\"}");
            goto end;

              del:
            sbSQL.Append("delete  [Device]  where [DevId]='"+context.Request.Form["deviceNo"]+"'");
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