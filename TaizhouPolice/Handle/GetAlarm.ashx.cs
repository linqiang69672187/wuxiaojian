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
    /// GetAlarm 的摘要说明
    /// </summary>
    public class GetAlarm : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            StringBuilder sqltext = new StringBuilder();
            string DevType = context.Request.Form["type"]; //设备类型ID
            string ssdd = context.Request.Form["ssdd"]; //所属大队ID
            string sszd = context.Request.Form["sszd"]; //所属中队ID
            string search = context.Request.Form["search"]; //搜索框车辆、人员、设备编号
            string begintime = context.Request.Form["begintime"];
            string endtime = context.Request.Form["endtime"];
            string alramtype = context.Request.Form["alramtype"]; //告警类型 在线时长、处理量
            string alarmState = context.Request.Form["alarmState"]; //告警状态 1告警 0 正常





            if (ssdd=="all")
            {
                sqltext.Append("SELECT  al.[Id],dt.TypeName as dtypename,al.[DevId], CONVERT(varchar(100), [AlarmDay], 102) as AlarmDay,de.Tel1 as Tel,[AlarmState],[AlarmType],at.TypeName as aTypeName,de.PlateNumber,de.Contacts,et1.Name as zName,et2.Name as dName FROM [Alarm_EveryDayInfo] al Left join AlarmType at on at.Id = al.AlarmType left join Device de on de.DevId=al.DevId left join  Entity et1 on et1.ID = de.EntityId left join Entity et2 on et2.ID = et1.ParentID left join DeviceType dt on dt.ID = de.DevType where de.DevType=" + DevType + "");

            }
            else
            {
                if (sszd == "all")
                {
                    sqltext.Append("WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + ssdd + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM  [Entity] A,childtable b where a.[ParentID] = b.[ID])SELECT  al.[Id],dt.TypeName as dtypename,al.[DevId], CONVERT(varchar(100), [AlarmDay], 102) as AlarmDay,de.Tel1 as Tel,[AlarmState],[AlarmType],at.TypeName as aTypeName,de.PlateNumber,de.Contacts,et1.Name as zName,et2.Name as dName FROM [Alarm_EveryDayInfo] al Left join AlarmType at on at.Id = al.AlarmType left join Device de on de.DevId=al.DevId left join  Entity et1 on et1.ID = de.EntityId left join Entity et2 on et2.ID = et1.ParentID left join DeviceType dt on dt.ID = de.DevType where de.DevType=" + DevType + " and  de.EntityId in (select ID from childtable)");

                }
                else
                {
                    sqltext.Append("SELECT  al.[Id],dt.TypeName as dtypename,al.[DevId], CONVERT(varchar(100), [AlarmDay], 102) as AlarmDay,de.Tel1 as Tel,[AlarmState],[AlarmType],at.TypeName as aTypeName,de.PlateNumber,de.Contacts,et1.Name as zName,et2.Name as dName FROM [Alarm_EveryDayInfo] al Left join AlarmType at on at.Id = al.AlarmType left join Device de on de.DevId=al.DevId left join  Entity et1 on et1.ID = de.EntityId left join Entity et2 on et2.ID = et1.ParentID left join DeviceType dt on dt.ID = de.DevType where de.DevType=" + DevType + " and  de.EntityId = " + sszd + "");


                }

            }

            if (alramtype != "all")
            {
                sqltext.Append(" and AlarmType =" + alramtype);

            }

            if (alramtype != "all")
            {
                sqltext.Append(" and AlarmType =" + alramtype);

            }
            if (alarmState != "all")
            {
                sqltext.Append(" and AlarmState =" + alarmState);

            }

            sqltext.Append(" and AlarmDay >='"+begintime+"'");
            sqltext.Append(" and AlarmDay <='"+endtime+"'");

            if (search != "")
            {
                sqltext.Append(" and ( de.PlateNumber like '%" + search + "%' or de.Contacts  like '%" + search + "%' or al.[DevId]  like '%" + search + "%'  )");
            }

            System.Data.DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");


            context.Response.Write(JSON.DatatableToDatatableJS(dt, ""));
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