using GemBox.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace TaizhouPolice.Handle
{
    /// <summary>
    /// ExportaAnalysisExcel 的摘要说明
    /// </summary>
    public class ExportaAnalysisExcel : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {

            ExcelFile excelFile = new ExcelFile();
           // HttpContext.Current.Server.MapPath("Upload" + "\\daoru.xls");
            var tmpath = HttpContext.Current.Server.MapPath("templet\\对讲机及车载视频报表模板.xls");
            excelFile.LoadXls(tmpath);
            ExcelWorksheet sheet = excelFile.Worksheets[0];

            sheet.Rows[7].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;

            sheet.Rows[7].Cells["B"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0,0,0), LineStyle.Thin);


            sheet.Rows[7].Cells[1].Value = "111";

         
            tmpath = HttpContext.Current.Server.MapPath("upload\\对讲机及车载视频报表.xls");

            excelFile.SaveXls(tmpath);  

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