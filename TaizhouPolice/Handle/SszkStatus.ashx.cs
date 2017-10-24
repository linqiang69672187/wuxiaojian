using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;

namespace TaizhouPolice.Handle
{
    /// <summary>
    /// SszkStatus 的摘要说明
    /// </summary>
    public class SszkStatus : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
             //search: $(".seach-box input").val(),
             // type: 1,
             // ssdd: $("#brigadeselect1").val(),
             // sszd: $("#squadronselect1").val()
            string ssdd = context.Request.Form["ssdd"];
            string sszd = context.Request.Form["sszd"];
            string search = context.Request.Form["search"];
            string sortMode1 = context.Request.Form["sortMode1"];
            string type = context.Request.Form["type"];
            string status = context.Request.Form["status"];
            string searchcondition ="";
            context.Response.ContentType = "text/plain";

            StringBuilder sqltext = new StringBuilder();

            searchcondition = (search == "") ? " and  IsOnline<>'' " : " and IsOnline<>''  and(de.[DevId] like '%" + search + "%' or de.PlateNumber like '%" + search + "%' or de.Contacts like  '%" + search + "%')";

            if (ssdd == "all") {
                if (status == "all") {
                    sqltext.Append("SELECT [HandleCnt],[OnlineTime],[IsOnline],[PlateNumber],[Contacts],de.DevId as PDAID,de.EntityId,de.[Cartype],de.[IMEI],de.[UserNum] FROM [Gps] gps right join Device de on gps.PDAID = de.DevId  where de.[DevType] =" + type + searchcondition + "   order by " + sortMode1);
                }
                else
                {
                    sqltext.Append("SELECT [HandleCnt],[OnlineTime],[IsOnline],[PlateNumber],[Contacts],de.DevId as PDAID,de.EntityId,de.[Cartype],de.[IMEI],de.[UserNum] FROM [Gps] gps right join Device de on gps.PDAID = de.DevId where de.[DevType] =" + type + " and gps.IsOnline = '" + status + "'" + searchcondition + "  order by " + sortMode1);

                }
                goto end;
            }
            if (sszd == "all") {
                if (status == "all")
                {
                    sqltext.Append("WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + ssdd + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM  [Entity] A,childtable b where a.[ParentID] = b.[ID]) SELECT [HandleCnt],[OnlineTime],[IsOnline],[PlateNumber],[Contacts],de.DevId as PDAID,de.EntityId,de.[Cartype],de.[IMEI],de.[UserNum] FROM [Gps] gps right join Device de on gps.PDAID = de.DevId where de.[DevType] =" + type + "  and de.EntityId in (select ID from childtable)" + searchcondition + "  order by " + sortMode1);
                }
                else
                {
                    sqltext.Append("WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + ssdd + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM  [Entity] A,childtable b where a.[ParentID] = b.[ID]) SELECT [HandleCnt],[OnlineTime],[IsOnline],[PlateNumber],[Contacts],de.DevId as PDAID,de.EntityId,de.[Cartype],de.[IMEI],de.[UserNum] FROM [Gps] gps right join Device de on gps.PDAID = de.DevId where de.[DevType] =" + type + "  and gps.IsOnline = '" + status + "'  and de.EntityId in (select ID from childtable)" + searchcondition + "  order by " + sortMode1);

                }
                   goto end;
            }
            if (status == "all")
            {
                sqltext.Append("SELECT [HandleCnt],[OnlineTime],[IsOnline],[PlateNumber],[Contacts],de.DevId as PDAID,de.EntityId,de.[Cartype],de.[IMEI],de.[UserNum] FROM Gps as gps right join Device as de on de.DevId = gps.PDAID  where de.[DevType] =" + type + " and [EntityId] =" + Convert.ToInt16(sszd) + searchcondition + " order by " + sortMode1);
            }
            else
            {
                sqltext.Append("SELECT [HandleCnt],[OnlineTime],[IsOnline],[PlateNumber],[Contacts],de.DevId as PDAID,de.EntityId,de.[Cartype],de.[IMEI],de.[UserNum] FROM Gps as gps right join Device as de on de.DevId = gps.PDAID  where de.[DevType] =" + type + "and gps.IsOnline = '" + status + "'  and [EntityId] =" + Convert.ToInt16(sszd) + searchcondition + "   order by " + sortMode1);
            }
            end:


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