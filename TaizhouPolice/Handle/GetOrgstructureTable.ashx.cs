using DbComponent;
using GemBox.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Web;

namespace TaizhouPolice.Handle
{
    /// <summary>
    /// GetOrgstructureTable 的摘要说明
    /// </summary>
    public class GetOrgstructureTable : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

           // devtype, selectEntityID, selectcontatcs, selectDepth
            string devtype = context.Request.Form["devtype"]; //设备类型
            string selectEntityID = context.Request.Form["selectEntityID"]; //单位ID
            string selectcontatcs = context.Request.Form["selectcontatcs"]; //selectcontatcs联系人
            string selectDepth = context.Request.Form["selectDepth"]; //selectcontatcs联系人

            StringBuilder sqltext = new StringBuilder();
            switch (selectDepth)
            {
                case "1":
                    sqltext.Append(" SELECT de.DevId,de.[Contacts],de.[EntityId],gp.[Value] as 在线时长,de.[PlateNumber],(CASE WHEN convert(varchar,[AlarmType])+convert(varchar,[AlarmState]) ='41' THEN '视频时长预警' WHEN convert(varchar,[AlarmType])+convert(varchar,[AlarmState]) ='11' THEN '在线时长预警' ELSE '正常' END) AS 状态,[AlarmDay],de.[UserNum] as 警号,de.IMEI,de.tel1 as 电话号码   FROM [Alarm_EveryDayInfo] as gp left join [Device] as de on de.DevId = gp.DevId left join  [Entity] as en on de.[EntityId]=en.[ID]");
                sqltext.Append(" where   AlarmType in(1,4)  and DATEDIFF(d,gp.AlarmDay,GETDATE()) = 1 and de.[DevType] = " + devtype);

                    break;
                case "2":
                    sqltext.Append("WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + selectEntityID + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM [Entity] A,childtable b where a.[ParentID] = b.[ID])  SELECT de.DevId,de.[Contacts],de.[EntityId],gp.[Value] as 在线时长,de.[PlateNumber],(CASE WHEN convert(varchar,[AlarmType])+convert(varchar,[AlarmState]) ='41' THEN '视频时长预警' WHEN convert(varchar,[AlarmType])+convert(varchar,[AlarmState]) ='11' THEN '在线时长预警' ELSE '正常' END) AS 状态,[AlarmDay],de.[UserNum] as 警号,de.IMEI,de.tel1 as 电话号码   FROM [Alarm_EveryDayInfo] as gp left join [Device] as de on de.DevId = gp.DevId left join  [Entity] as en on de.[EntityId]=en.[ID]");
                    sqltext.Append(" where  de.EntityId in (select ID from childtable)  and AlarmType in(1,4)  and DATEDIFF(d,gp.AlarmDay,GETDATE()) = 1 and de.[DevType] = " + devtype);

                  break;
                case "3":
                  sqltext.Append(" SELECT de.DevId,de.[Contacts],de.[EntityId],gp.[Value] as 在线时长,de.[PlateNumber],(CASE WHEN convert(varchar,[AlarmType])+convert(varchar,[AlarmState]) ='41' THEN '视频时长预警' WHEN convert(varchar,[AlarmType])+convert(varchar,[AlarmState]) ='11' THEN '在线时长预警' ELSE '正常' END) AS 状态,[AlarmDay],de.[UserNum] as 警号,de.IMEI,de.tel1 as 电话号码   FROM [Alarm_EveryDayInfo] as gp left join [Device] as de on de.DevId = gp.DevId left join  [Entity] as en on de.[EntityId]=en.[ID]");
                  sqltext.Append(" where  de.EntityId =" + selectEntityID + "  and AlarmType in(1,4)  and DATEDIFF(d,gp.AlarmDay,GETDATE()) = 1 and de.[DevType] = " + devtype);

                    break;

                default:
                    break;
            }
            if (selectcontatcs != "") { sqltext.Append(" and de.[Contacts]='" + selectcontatcs + "'"); }
            sqltext.Append("  order by  en.Sort");
            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");
            string reTitle = ExportExcel(dt, devtype, selectDepth, selectEntityID);
            context.Response.Write(JSON.DatatableToDatatableJS(dt, reTitle));
        }
        public string ExportExcel(DataTable dt, string type, string selectDepth,string selectEntityID)
        {
            ExcelFile excelFile = new ExcelFile();
            string entityTitle = null;

            var tmpath = HttpContext.Current.Server.MapPath("templet\\数据管理\\" + type + "1" + ".xls");
            excelFile.LoadXls(tmpath);
            ExcelWorksheet sheet = excelFile.Worksheets[0];



            DataTable dtEntity = null;  //单位信息表
            dtEntity = SQLHelper.ExecuteRead(CommandType.Text, "SELECT [ID],[Name],[ParentID],[Depth] from [Entity]", "2");

            String parentid = null;

            switch (selectDepth)
            {
                case "1":
                    entityTitle = "台州交警局";
                    break;
                case "2":
                    for (int h = 0; h < dtEntity.Rows.Count; h++)
                    {
                        if (dtEntity.Rows[h][0].ToString() == selectEntityID)
                        {
                            entityTitle = dtEntity.Rows[h][1].ToString();
                            break;
                        }
                    }

                    break;
                case "3":

                    for (int h = 0; h < dtEntity.Rows.Count; h++)
                    {
                        if (dtEntity.Rows[h][0].ToString() == selectEntityID)
                        {
                            entityTitle = dtEntity.Rows[h][1].ToString();
                            parentid = dtEntity.Rows[h][2].ToString();
                            break;
                        }
                    }
                    for (int h = 0; h < dtEntity.Rows.Count; h++)
                    {
                        if (dtEntity.Rows[h][0].ToString() == parentid)
                        {
                            entityTitle = dtEntity.Rows[h][1].ToString() + entityTitle;
              
                            break;
                        }
                    }


                    break;
                default:
                    break;
            }




            string title = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd");




            for (int i = 0; i < dt.Rows.Count; i++)
            {
                ExcelRow row = sheet.Rows[i + 2];
                row.Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                row.Cells["A"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                row.Cells["B"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                row.Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                row.Cells["D"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                row.Cells["E"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                row.Cells["F"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                row.Cells["G"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                row.Cells["H"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                row.Cells["A"].Value = i + 1;

             

                    for (int h = 0; h < dtEntity.Rows.Count; h++)
                    {
                        if (dtEntity.Rows[h][0].ToString() == dt.Rows[i]["EntityId"].ToString())
                        {
                            row.Cells["C"].Value = dtEntity.Rows[h][1].ToString();
                            parentid = dtEntity.Rows[h][2].ToString();
                            break;
                        }
                    }

                    for (int h = 0; h < dtEntity.Rows.Count; h++)
                    {
                        if (dtEntity.Rows[h][0].ToString() == parentid)
                        {
                            row.Cells["B"].Value = dtEntity.Rows[h][1].ToString();
                            break;
                        }
                    }
                    if (type == "1" )
                    {
                        row.Cells["D"].Value = dt.Rows[i]["PlateNumber"].ToString();
                    }
                    else
                    {
                        row.Cells["D"].Value = dt.Rows[i]["DevId"].ToString();
                    }

                    if (dt.Rows[i]["在线时长"].ToString() != "")
                    {
                        row.Cells["F"].Value = Convert.ToDouble((Convert.ToDouble(dt.Rows[i]["在线时长"].ToString()) / 3600).ToString("0.00"));
                    }
                    else
                    {
                        row.Cells["F"].Value = 0;
                    }
                    row.Cells["E"].Value = dt.Rows[i]["Contacts"].ToString();
                    row.Cells["G"].Value = dt.Rows[i]["状态"].ToString();
                    row.Cells["H"].Value = title;
                }

         


          
            switch (type)
            {
                case "1":
                    sheet.Rows[0].Cells[0].Value = title + entityTitle + "车载视频日报详情" ;
                    break;
                case "2":
                    sheet.Rows[0].Cells[0].Value = title + entityTitle + "对讲机日报详情";
                    break;
                case "3":
                    sheet.Rows[0].Cells[0].Value = title + entityTitle + "拦截仪日报详情";
                    break;
                case "4":
                    sheet.Rows[0].Cells[0].Value = title + entityTitle + "移动警务日报详情";
                    break;
                case "5":
                    sheet.Rows[0].Cells[0].Value = title + entityTitle + "执法记录仪日报详情";
                    break;
                default:

                    break;
            }
            tmpath = HttpContext.Current.Server.MapPath("upload\\sjtj\\" + sheet.Rows[0].Cells[0].Value + ".xls");
            excelFile.SaveXls(tmpath);
            return sheet.Rows[0].Cells[0].Value + ".xls";
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