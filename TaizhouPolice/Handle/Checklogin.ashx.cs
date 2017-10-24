using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaizhouPolice.Handle
{
    /// <summary>
    /// Checklogin 的摘要说明
    /// </summary>
    public class Checklogin : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string username = context.Request["username"];
            string pwd = context.Request["pwd"];
            DbComponent.login.loginin(username, pwd);

            if (DbComponent.login.loginin(username, pwd) == 0)
            {
                context.Response.Write("{\"result\":\"账号或密码不存在\",\"r\":\"1\"}");

            }
            else
            {
                context.Response.Cookies["username"].Value = username; 
                context.Response.Write("{\"result\":\"登录成功\",\"r\":\"0\"}");
            }
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