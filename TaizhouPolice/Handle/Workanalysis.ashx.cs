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
    /// Workanalysis 的摘要说明
    /// </summary>
    public class Workanalysis : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string sbmc = context.Request.Form["sbmc"];
            string onlinetype = context.Request.Form["onlinetype"];
            string begintime = context.Request.Form["begintime"];
            string endtime = context.Request.Form["endtime"];
            string endabletime = context.Request.Form["endabletime"];
            string ssdd = context.Request.Form["ssdd"];
            string sszd = context.Request.Form["sszd"];
            string lxren = context.Request.Form["lxren"];
            string coumm;//在线时长和处理量查询列
            StringBuilder sqltext = new StringBuilder();
           

            switch (onlinetype)
            {
                case "zxsc":
                case "cll":
                    if (onlinetype == "zxsc") { coumm = "gps.OnlineTime"; } else { coumm = "gps.HandleCnt"; }
                    if (ssdd == "all") { sqltext.Append("select enty.Name as name,sumsc as y  from (SELECT ent.ParentID ,sum(" + coumm + ") as sumsc FROM [EverydayInfo] as gps LEFT JOIN  [Device]  as  de on de.DevId= gps.DevId LEFT JOIN  [Entity] ent on de.EntityId = ent.ID  where [Time]>'" + begintime + "' and [Time]<'" + endtime + "' and de.DevType='" + sbmc + "'   group by ent.ParentID) as grps  LEFT JOIN [Entity] as  enty  on enty.ID = grps.ParentID"); break; }
                    if (sszd == "all") { sqltext.Append("WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + Convert.ToInt16(ssdd) + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM  [Entity] A,childtable b where a.[ParentID] = b.[ID]) select enty.Name as name,sumsc as y  from (SELECT  de.EntityId,sum(" + coumm + ") as sumsc FROM [EverydayInfo] as gps LEFT JOIN  [Device]  as  de on de.DevId= gps.DevId where [Time]>'" + begintime + "'  and [Time]<'" + endtime + "'  and de.DevType='" + sbmc + "'   and  de.EntityId in (select id from childtable )    group by de.EntityId) as grps  LEFT JOIN [Entity] as  enty  on enty.ID = grps.EntityId"); break; }
                    if (lxren == "all") { sqltext.Append("SELECT de.Contacts as name, sum(" + coumm + ") as y  FROM [EverydayInfo] gps Left join [Device] as  de on de.DevId= gps.DevId  where de.EntityId = " + Convert.ToInt16(sszd) + "  and  [Time]>'" + begintime + "'  and [Time]<'" + endtime + "'  and de.DevType='" + sbmc + "'  group by de.Contacts"); break; }
                    sqltext.Append("select [TypeName] as name,sumc as y from   (SELECT de.DevType , sum(OnlineTime) as sumc FROM [EverydayInfo] gps Left join [Device] as  de on de.DevId= gps.DevId  where de.Contacts = '" + lxren + "'  and  [Time]>'" + begintime + "'  and [Time]<'" + endtime + "'  and de.DevType='" + sbmc + "'    group by de.DevType) as sb Left join DeviceType dt on dt.ID = sb.DevType");
                    break;

                default:
                    break;
            }




            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");

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