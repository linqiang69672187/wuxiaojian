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
    /// GetDataManagement 的摘要说明
    /// </summary>
    public class GetDataManagement : IHttpHandler
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
            string state = context.Request.Form["state"];
            string typelx = context.Request.Form["typelx"]; //表格类型汇总OR明细
            string title = "";
            if (context.Request.Form["ssddtext"] == "全部")
            {
                title = "台州交警局";
            }
            else
            {
                title = context.Request.Form["ssddtext"];
            }

            if (context.Request.Form["sszdtext"] != "全部")
            {
                title += context.Request.Form["sszdtext"];
            }

            StringBuilder sqltext = new StringBuilder();
            string sreachcondi ="";

            if (search != "") {
                sreachcondi = " (de.[DevId] like '%" + search + "%' or de.[PlateNumber] like '%" + search + "%' or de.[Contacts] like '%" + search + "%' ) and ";
            }

            if (typelx == "0") {
                goto huizong;//跳转汇总
            }
            else
            {
                goto mingxi;//跳转明细
            }
            huizong:
            //所有大队
            if (ssdd == "all")
            {
                sqltext.Append("SELECT tb.* from ( SELECT  COUNT(gp.id) as 总数,AlarmDay,SUM(value) as 在线时长,sum([AlarmState]) as 预警总数,(CASE WHEN sum([AlarmState]) >0 THEN '有预警' ELSE '正常' END) AS 状态,'' as PlateNumber,'' as Contacts,[ParentID] as EntityId  FROM [Alarm_EveryDayInfo] as gp left join [Device] as de on de.DevId = gp.DevId left join  [Entity] as en on de.[EntityId]=en.[ID]");
                sqltext.Append(" where " + sreachcondi + "  AlarmType in (1,4) and  gp.[AlarmDay ] >='" + begintime + "' and gp.[AlarmDay ] <='" + endtime + "' ");

                if (type != "all")
                {
                    sqltext.Append(" and de.[DevType] = " + type + "");
                }

                if (state != "all")
                {
                    sqltext.Append(" and gp.[AlarmState] = " + state + "");
                }

                sqltext.Append(" group by AlarmDay,ParentID ) tb left join [Entity] en2 on tb.EntityId = en2.ID order by en2.[Sort],AlarmDay");

                goto end;
            }
            if (sszd == "all")
            {
                sqltext.Append("WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + ssdd + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM [Entity] A,childtable b where a.[ParentID] = b.[ID]) SELECT  COUNT(gp.id) as 总数,AlarmDay,SUM(value) as 在线时长,sum([AlarmState]) as 预警总数,(CASE WHEN sum([AlarmState]) >0 THEN '有预警' ELSE '正常' END) AS 状态,'' as PlateNumber,'' as Contacts,[ParentID] as EntityId  FROM [Alarm_EveryDayInfo] as gp left join [Device] as de on de.DevId = gp.DevId  left join  [Entity] as en on de.[EntityId]=en.[ID]");
                sqltext.Append(" where " + sreachcondi + " de.EntityId in (select ID from childtable)  and AlarmType in (1,4) and  gp.[AlarmDay ] >='" + begintime + "' and gp.[AlarmDay ] <='" + endtime + "' ");

                if (type != "all")
                {
                    sqltext.Append(" and de.[DevType] = " + type + "");
                }

                if (state != "all")
                {
                    sqltext.Append(" and gp.[AlarmState] = " + state + "");
                }

                sqltext.Append(" group by AlarmDay,ParentID");

                goto end;
            }
            else

            {

                sqltext.Append(" SELECT COUNT(gp.id) as 总数,AlarmDay,SUM(value) as 在线时长,sum([AlarmState]) as 预警总数,(CASE WHEN sum([AlarmState]) >0 THEN '有预警' ELSE '正常' END) AS 状态,'' as PlateNumber,'' as Contacts,ParentID as EntityId  FROM [Alarm_EveryDayInfo] as gp left join [Device] as de on de.DevId = gp.DevId left join  [Entity] as en on de.[EntityId]=en.[ID]");
                sqltext.Append(" where " + sreachcondi + " de.EntityId = " + sszd + " and  gp.[AlarmDay] >='" + begintime + "' and gp.[AlarmDay] <='" + endtime + "' ");

                if (type != "all")
                {
                    sqltext.Append(" and de.[DevType] = " + type + "");
                }
                if (state != "all")
                {
                    sqltext.Append(" and gp.[AlarmState] = " + state + "");
                }
                sqltext.Append(" group by AlarmDay,en.ParentID");

                goto end;
            }


            mingxi:

            if (ssdd == "all")
            {

                sqltext.Append(" SELECT de.DevId,de.[Contacts],de.[EntityId],gp.[Value] as 在线时长,de.[PlateNumber],(CASE WHEN convert(varchar,[AlarmType])+convert(varchar,[AlarmState]) ='41' THEN '视频时长预警' WHEN convert(varchar,[AlarmType])+convert(varchar,[AlarmState]) ='11' THEN '在线时长预警' ELSE '正常' END) AS 状态,[AlarmDay],'1' as 总数,[AlarmState] as 预警总数  FROM  [Alarm_EveryDayInfo] as gp left join [Device] as de on de.DevId = gp.DevId   left join  [Entity] as en on de.[EntityId]=en.[ID] left join  [Entity] as en2 on en2.[Id]=en.[ParentID]");
                sqltext.Append(" where " + sreachcondi + " gp.[AlarmDay] >='" + begintime + "' and gp.[AlarmDay] <='" + endtime + "'  and AlarmType in (1,4) ");

                if (type != "all")
                {
                    sqltext.Append(" and de.[DevType] = " + type + "");
                }
                if (state != "all")
                {
                    sqltext.Append(" and gp.[AlarmState] = " + state + "");
                }
                sqltext.Append(" order by [AlarmDay],en2.Sort,en.Sort");

                goto end;
            }

            if (sszd == "all")
            {
                sqltext.Append("WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + ssdd + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM [Entity] A,childtable b where a.[ParentID] = b.[ID])  SELECT de.DevId,de.[Contacts],de.[EntityId],gp.[Value] as 在线时长,de.[PlateNumber],(CASE WHEN convert(varchar,[AlarmType])+convert(varchar,[AlarmState]) ='41' THEN '视频时长预警' WHEN convert(varchar,[AlarmType])+convert(varchar,[AlarmState]) ='11' THEN '在线时长预警' ELSE '正常' END)  AS 状态,[AlarmDay],'1' as 总数,[AlarmState] as 预警总数   FROM [Alarm_EveryDayInfo] as gp left join [Device] as de on de.DevId = gp.DevId   left join  [Entity] as en on de.[EntityId]=en.[ID]");
                sqltext.Append(" where " + sreachcondi + " de.EntityId in (select ID from childtable)  and AlarmType in (1,4) and gp.[AlarmDay] >='" + begintime + "' and gp.[AlarmDay] <='" + endtime + "' ");

                if (type != "all")
                {
                    sqltext.Append(" and de.[DevType] = " + type + "");
                }
                if (state != "all")
                {
                    sqltext.Append(" and gp.[AlarmState] = " + state + "");
                }
                sqltext.Append(" order by  [AlarmDay],en.Sort");

                goto end;
            }
            else
            {

                sqltext.Append(" SELECT de.DevId,de.[Contacts],de.[EntityId],gp.[Value] as 在线时长,de.[PlateNumber],(CASE WHEN convert(varchar,[AlarmType])+convert(varchar,[AlarmState]) ='41' THEN '视频时长预警' WHEN convert(varchar,[AlarmType])+convert(varchar,[AlarmState]) ='11' THEN '在线时长预警' ELSE '正常' END)  AS 状态,[AlarmDay],'1' as 总数,[AlarmState] as 预警总数  FROM  [Alarm_EveryDayInfo] as gp left join [Device] as de on de.DevId = gp.DevId");
                sqltext.Append(" where " + sreachcondi + " de.EntityId = " + sszd + " and gp.[AlarmDay] >='" + begintime + "' and gp.[AlarmDay] <='" + endtime + "'  and AlarmType in (1,4) ");

                if (type != "all")
                {
                    sqltext.Append(" and de.[DevType] = " + type + "");
                }
                if (state != "all")
                {
                    sqltext.Append(" and gp.[AlarmState] = " + state + "");
                }
                sqltext.Append(" order by [AlarmDay]");

                goto end;
            }







            end:

           
            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");


            string reTitle = ExportExcel(dt, type, begintime, endtime, title, ssdd, sszd, context.Request.Form["ssddtext"], context.Request.Form["sszdtext"], typelx);

            context.Response.Write(JSON.DatatableToDatatableJS(dt, reTitle));
        
        }

        public string ExportExcel(DataTable dt, string type, string begintime, string endtime, string entityTitle, string ssdd, string sszd, string ssddtext, string sszdtext, string typelx)
        {
            ExcelFile excelFile = new ExcelFile();


            var tmpath = HttpContext.Current.Server.MapPath("templet\\数据管理\\"+type+typelx+".xls");
            excelFile.LoadXls(tmpath);
            ExcelWorksheet sheet = excelFile.Worksheets[0];


            DateTime bg = Convert.ToDateTime(begintime);
            DateTime ed = Convert.ToDateTime(endtime);

            DataTable dtEntity = null;  //单位信息表
            dtEntity = SQLHelper.ExecuteRead(CommandType.Text, "SELECT [ID],[Name],[ParentID],[Depth] from [Entity]", "2");

            String parentid =null;


            int days = (ed - bg).Days;
            string title = "";

            if (days >= 190) //季度
            {
                title = bg.Year.ToString() + "年";
            }
            else if (days > 100 && days < 190) //季度
            {
                if (bg.Month >= 6)
                {
                    title = "下半年";
                }
                else
                {
                    title = "上半年";
                }
                title = bg.Year.ToString() + "年" + title;
            }
            else if (days > 31 && days < 100) //季度
            {
                if (bg.Month > 9)
                {
                    title = "第四季度";
                }
                else if (6 < bg.Month && bg.Month <= 9)
                {
                    title = "第三季度";
                }
                else if (3 < bg.Month && bg.Month <= 6)
                {
                    title = "第二季度";
                }
                else
                {
                    title = "第一季度";
                }
                title = bg.Year.ToString() + "年" + title;

            }
            else if (days > 7) //季度
            {
                title = bg.Year.ToString() + "年" + bg.Month.ToString() + "月份";
            }
            else if (days <= 7) //周
            {
                title = begintime.Replace("/", "-") + "_" + endtime.Replace("/", "-");
            }

           
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

                if (typelx == "0") //汇总
                {
                    for (int h = 0; h < dtEntity.Rows.Count; h++)
                    {
                        if (dtEntity.Rows[h][0].ToString() == dt.Rows[i][7].ToString())
                        {
                            row.Cells["B"].Value = dtEntity.Rows[h][1].ToString();
                            break;
                        }
                    }
                    row.Cells["C"].Value = (sszd == "all") ? "/" : sszdtext;
                    row.Cells["D"].Value = Convert.ToInt32(dt.Rows[i][0].ToString());
                    if (dt.Rows[i]["在线时长"].ToString() != "")
                    {
                        row.Cells["E"].Value = Convert.ToDouble((Convert.ToDouble(dt.Rows[i]["在线时长"].ToString()) / 3600).ToString("0.00"));
                     }
                    else
                    {
                        row.Cells["E"].Value = 0;
                    }
                    row.Cells["F"].Value = dt.Rows[i]["状态"].ToString();
                    row.Cells["G"].Value = Convert.ToInt32(dt.Rows[i]["预警总数"].ToString());
                    row.Cells["H"].Value = Convert.ToDateTime(dt.Rows[i]["AlarmDay"]).ToString("yyyy-MM-dd");
                }
                else //明细
                {

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
              
                    if (dt.Rows[i]["在线时长"].ToString()!=""){
                      row.Cells["F"].Value =Convert.ToDouble((Convert.ToDouble(dt.Rows[i]["在线时长"].ToString()) / 3600).ToString("0.00"));
                    }
                    else
                    {
                      row.Cells["F"].Value = 0;
                    }
                    row.Cells["E"].Value = dt.Rows[i]["Contacts"].ToString();
                    row.Cells["G"].Value = dt.Rows[i]["状态"].ToString();
                    row.Cells["H"].Value = Convert.ToDateTime(dt.Rows[i]["AlarmDay"]).ToString("yyyy-MM-dd");
                }

            }


            if (typelx == "0")
            {
                typelx = "日报表汇总";
            }
            else
            {
                typelx = "日报表详情";
            }
            switch (type)
            {
                case "1":
                    sheet.Rows[0].Cells[0].Value = title + entityTitle + "车载视频" + typelx;
                    break;
                case "2":
                    sheet.Rows[0].Cells[0].Value = title + entityTitle + "对讲机" + typelx;
                    break;
                case "3":
                    sheet.Rows[0].Cells[0].Value = title + entityTitle + "拦截仪" + typelx;
                    break;
                case "4":
                    sheet.Rows[0].Cells[0].Value = title + entityTitle + "移动警务" + typelx;
                    break;
                case "5":
                    sheet.Rows[0].Cells[0].Value = title + entityTitle + "执法记录仪" + typelx;
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