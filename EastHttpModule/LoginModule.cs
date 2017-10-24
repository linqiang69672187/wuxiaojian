using MyModel;
using System;
using System.Web;

namespace EastHttpModule
{
    public class LoginModule : IHttpModule
    {
        #region IHttpModule member
        public static readonly log4net.ILog log = log4net.LogManager.GetLogger(typeof(LoginModule));
        public void Dispose()
        {

        }

        public void Init(HttpApplication context)
        {
            context.PreRequestHandlerExecute += new EventHandler(context_PreRequestHandlerExecute);
        }
        private void context_PreRequestHandlerExecute(object sender, EventArgs e)
        {

            HttpApplication app = sender as HttpApplication;
            string strPath = app.Context.Request.Url.ToString();
            if (strPath.ToLower().IndexOf(".aspx") == -1)
            {
                return;
            }
            if (strPath.ToLower().IndexOf("layercontrol.aspx") !=-1)//Filter Page Of brush GPS
            {
                return;
            }
            if (strPath.ToLower().IndexOf("lanuagexmltojson.aspx") != -1)//Filter Page Of Lang Resource
            {
                return;
            }
            if (strPath.ToLower().IndexOf("getdefaultlanguage.aspx") != -1)//Filter Page Of Lang Resource
            {
                return;
            }
            if (strPath.ToLower().IndexOf("loginverify.aspx") != -1)//Filter Page Of Lang Resource
            {
                return;
            }
            if (strPath.ToLower().IndexOf("isexternalverify.aspx") != -1)//Filter Page Of Lang Resource
            {
                return;
            }
            int n = strPath.ToLower().IndexOf("login.html");
            if (n == -1)
            {
                if (app.Context.Request.Cookies["username"] == null)
                {
                    log.Debug(DateTime.Now.ToString());
                    app.Context.Response.Redirect("~/login.html");
                }
                else
                {
                    if (app.Context.Request.Cookies["myissi"] != null)
                    {
                        string DispatchISSI = app.Context.Request.Cookies["myissi"].Value.ToString();
                        #region Print Log，except exception of "ISFindLoginDispatch"
                        log.Debug(DispatchISSI + " in PC " + app.Context.Request.UserHostAddress + " Request  " + strPath + ";");
                        log.Debug("Oper Dispatch's ISSI NO. is " + DispatchISSI);
                        log.Debug("Online User Count is " + LoginDispatchList.GetLoginDispatchCount().ToString());
                        if (LoginDispatchList.GetLoginDispatchCount() > 0)
                        {
                            foreach (LoginDispatch ld in LoginDispatchList.listLD)
                            {
                                log.Debug("Dispatch's ISSI is " + ld.DispatchISSI + ";Login time is " + ld.LoginTime.ToString());
                            }
                        }
                        #endregion
                        if (LoginDispatchList.ISFindLoginDispatch(DispatchISSI))// update logining issi's oper time
                        {
                            LoginDispatchList.UpdateLoginTime(DispatchISSI, DateTime.Now);
                        }
                        else
                        {
                            LoginDispatchList.AddLoginDispatch(new LoginDispatch() { DispatchISSI = DispatchISSI, LoginTime = DateTime.Now });
                        }
                    }
                }
            }

        }
        #endregion
    }
}
