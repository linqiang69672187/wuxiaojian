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
    /// GetDevicesToManage 的摘要说明
    /// </summary>
    public class GetDevicesToManage : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string search = context.Request.Form["search"];
            string type = context.Request.Form["type"];
            string begintime = context.Request.Form["begintime"];
            string endtime = context.Request.Form["endtime"];
            string ssdd = context.Request.Form["ssdd"];
            string sszd = context.Request.Form["sszd"];


            StringBuilder sqltext = new StringBuilder();


            ;

            //所有大队
            if (ssdd == "all")
            {
                sqltext.Append("SELECT de.ID, [EntityId],[DevType],[DevId] as 设备编号,[PlateNumber] as 车辆号码,[Contacts] as 联系人,[Tel1] as 联系电话,[CreatDate],[Cartype] as 车辆类型,et.Name as 所属部门,et2.Name as 所属单位,de.[UserNum] as 警号,de.[IdentityNum] as 身份证号,de.[SIMID],de.[IMEI],de.[IdentityPosition] FROM [Device] de left join Entity et on et.ID = de.EntityId left join  Entity et2 on et.ParentID = et2.ID ");
                sqltext.Append(" where  ([Contacts] like '%" + search + "%' or [DevId] like '%" + search + "%' or [PlateNumber] like '%" + search + "%') ");
                if (type != "all")
                {
                    sqltext.Append(" and de.[DevType] = " + type + " order by et2.sort,et.sort");
                }
                
                goto end;
            }
            if (sszd == "all")
            {

                sqltext.Append("WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + ssdd + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM  [Entity] A,childtable b where a.[ParentID] = b.[ID])  SELECT de.ID, [EntityId],[DevType],[DevId] as 设备编号,[PlateNumber] as 车辆号码,[Contacts] as 联系人,[Tel1] as 联系电话,[CreatDate],[Cartype] as 车辆类型,et.Name as 所属部门,et2.Name as 所属单位,de.[UserNum] as 警号,de.[IdentityNum] as 身份证号,de.[SIMID],de.[IMEI],de.[IdentityPosition] FROM [Device] de left join Entity et on et.ID = de.EntityId left join  Entity et2 on et.ParentID = et2.ID ");
                sqltext.Append(" where  ([Contacts] like '%" + search + "%' or [DevId] like '%" + search + "%' or [PlateNumber] like '%" + search + "%') ");
                if (type != "all")
                {
                    sqltext.Append(" and de.[DevType] = " + type + " and de.[EntityId] in (select ID from childtable)  order by et2.sort,et.sort");
                }
                
                goto end;
            }


            sqltext.Append("SELECT de.ID, [EntityId],[DevType],[DevId] as 设备编号,[PlateNumber] as 车辆号码,[Contacts] as 联系人,[Tel1] as 联系电话,[CreatDate],[Cartype] as 车辆类型,et.Name as 所属部门,et2.Name as 所属单位,de.[UserNum] as 警号,de.[IdentityNum] as 身份证号,de.[SIMID],de.[IMEI],de.[IdentityPosition] FROM [Device] de left join Entity et on et.ID = de.EntityId left join  Entity et2 on et.ParentID = et2.ID ");
                sqltext.Append(" where  ([Contacts] like '%" + search + "%' or [DevId] like '%" + search + "%' or [PlateNumber] like '%" + search + "%') ");
                if (type != "all")
                {
                    sqltext.Append(" and de.[DevType] = " + type + " and  [EntityId] = " + sszd + " order by et2.sort,et.sort");
                }

      



        end:

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