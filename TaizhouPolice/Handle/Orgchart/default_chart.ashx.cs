using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;

namespace TaizhouPolice.Handle.Orgchart
{
    /// <summary>
    /// default_sbfb 的摘要说明
    /// </summary>
    public class default_chart : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string type = context.Request.Form["type"];
            string begintime = context.Request.Form["sdate"];
            string endtime = context.Request.Form["edate"];

            int devtype = 0;
            switch (type)
            {
                case "车载视频":
                    devtype = 1;
                    break;

                case "警务通":
                    devtype = 4;
                    break;
                case "对讲机":
                    devtype = 2;
                    break;
                case "拦截仪":
                    devtype = 3;
                    break;
                case "执法记录仪":
                    devtype =5;
                    break;
                default:
                    break;

            }
            StringBuilder sqltext = new StringBuilder();
            switch (context.Request.Form["chart"])
            {
                case "sbfb":
                    sqltext.Append("select da.ParentID,da.总数 from (SELECT  en.ParentID,COUNT(*) as 总数 FROM [Device] as de  left join Entity as en on en.ID= de.EntityId where de.DevType = " + devtype + "    group by en.ParentID ) as da left join [JingWuTong].[dbo].Entity new on new.ID = da.ParentID ORDER BY   new.Sort");

                    break;
                case "sbzx":
                    sqltext.Append("select da.ParentID,da.总数,da.IsOnline from (SELECT  en.ParentID,gp.IsOnline,COUNT(*) as 总数 FROM Gps as gp left join [Device] as de on gp.PDAID = de.DevId  left join Entity as en on en.ID= de.EntityId where de.DevType =  " + devtype + "  group by en.ParentID,gp.IsOnline ) as da left join [JingWuTong].[dbo].Entity new on new.ID = da.ParentID ORDER BY   new.Sort");
                    break;
                case "yjzb":
                    sqltext.Append("select da.ParentID,da.总数,da.AlarmState from (SELECT  en.ParentID,gp.AlarmState,COUNT(*) as 总数 FROM [Alarm_EveryDayInfo] as gp left join [Device] as de on gp.DevId = de.DevId  left join Entity as en on en.ID= de.EntityId where de.DevType = " + devtype + " and gp.AlarmType in (1,4) and  DATEDIFF(d,[AlarmDay],GETDATE()) = 1  group by en.ParentID,gp.AlarmState ) as da left join [JingWuTong].[dbo].Entity new on new.ID = da.ParentID ORDER BY   new.Sort");
                    break;
                case "yjqs":
                    sqltext.Append("select da.ParentID,da.总数,da.AlarmDay,da.告警数 from (SELECT  en.ParentID,gp.AlarmDay,sum(gp.AlarmState) as 告警数 ,COUNT(*) as 总数 FROM [Alarm_EveryDayInfo] as gp left join [Device] as de on gp.DevId = de.DevId  left join Entity as en on en.ID= de.EntityId where de.DevType = " + devtype + " and gp.AlarmType in (1,4)  and  gp.[AlarmDay] >='" + begintime + "' and gp.[AlarmDay] <='" + endtime + "'  group by en.ParentID,gp.AlarmDay ) as da left join [JingWuTong].[dbo].Entity new on new.ID = da.ParentID ORDER BY   new.Sort,da.ParentID");
                    break;


                default:
                    sqltext.Append("SELECT  en.ParentID,gp.AlarmState,COUNT(*) as 总数 FROM [Alarm_EveryDayInfo] as gp left join [Device] as de on gp.DevId = de.DevId  left join Entity as en on en.ID= de.EntityId where de.DevType = " + devtype + " and gp.AlarmType=1 and  DATEDIFF(d,[AlarmDay],GETDATE()) = 1  group by en.ParentID,gp.AlarmState  order by en.ParentID");

                    break;


            }






            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "entity");
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