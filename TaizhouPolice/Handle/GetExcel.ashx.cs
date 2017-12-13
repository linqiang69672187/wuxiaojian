using DbComponent;
using GemBox.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace TaizhouPolice.Handle
{
    /// <summary>
    /// GetExcel 的摘要说明
    /// </summary>
    public class GetExcel : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
         
            string type = context.Request.Form["filename"];
            string uploadPath = HttpContext.Current.Server.MapPath("Upload" + "\\" + type+ ".xls");

            DataTable dt = SQLHelper.ExcelToDS(uploadPath);//获取EXCEL导入信息

            DataTable dtentiys = SQLHelper.ExecuteRead(CommandType.Text, "SELECT [ID], [JGDM]   FROM  [Entity] ", "entity"); //单位信息表

            DataTable dtdevices = SQLHelper.ExecuteRead(CommandType.Text, "SELECT [DevId]  FROM  [Device] ", "devices"); //设备信息表

            DataTable errtb = new DataTable("Datas"); //错误信息记录表

            ExcelFile excelFile = new ExcelFile();
            var tmpath = HttpContext.Current.Server.MapPath("Upload\\导入错误模版.xls");
            excelFile.LoadXls(tmpath);
            ExcelWorksheet sheet = excelFile.Worksheets[0];
            int errRows = 0; //错误行数




            errtb.Columns.Add("xuhao", Type.GetType("System.String"));
            errtb.Columns.Add("Description", Type.GetType("System.String"));

            DataTable rstb = new DataTable("result"); //最终结果集
            rstb.Columns.Add("EntityId", Type.GetType("System.String"));
            rstb.Columns.Add("DevType", Type.GetType("System.String"));
            rstb.Columns.Add("DevId", Type.GetType("System.String"));
            rstb.Columns.Add("Cartype", Type.GetType("System.String"));
            rstb.Columns.Add("PlateNumber", Type.GetType("System.String"));
            rstb.Columns.Add("Contacts", Type.GetType("System.String"));
            rstb.Columns.Add("IMEI", Type.GetType("System.String"));
            rstb.Columns.Add("Tel1", Type.GetType("System.String"));
            rstb.Columns.Add("SIMID", Type.GetType("System.String"));
            rstb.Columns.Add("IdentityNum", Type.GetType("System.String"));
            rstb.Columns.Add("IdentityPosition", Type.GetType("System.String"));
            rstb.Columns.Add("bz", Type.GetType("System.String"));

            for (int i = 1; i < dt.Rows.Count; i++)
            {
                DataRow newRow = rstb.NewRow();

                newRow["EntityId"] = "";

                if (dt.Rows[i][0].ToString().TrimEnd() == "" || dt.Rows[i][2].ToString().TrimEnd() == "")
                {
                    continue;
                }

                for (int ientitys = 0; ientitys < dtentiys.Rows.Count; ientitys++)
                {
                    if (dtentiys.Rows[ientitys]["JGDM"].ToString().TrimEnd() == dt.Rows[i][0].ToString().TrimEnd())
                    {
                        newRow["EntityId"] = dtentiys.Rows[ientitys]["ID"].ToString().TrimEnd();
                        break;
                    }
                }
                if (newRow["EntityId"].ToString() == "")
                {
                    errtb.Rows.Add(new object[] { "错误", "导入的EXCEL表第" + (i).ToString() + "行 [" + dt.Rows[i][0].ToString().TrimEnd() + "]单位机构代码不存在" });
                 
                    for (int hcoloms = 0; hcoloms < 11; hcoloms++)
                    {
                        sheet.Rows[errRows + 1].Cells[hcoloms].Value = dt.Rows[i][hcoloms].ToString();
                    }
                    sheet.Rows[errRows + 1].Cells[11].Value =  "单位机构代码不存在";
                    errRows += 1;
                    continue;
                }

                switch (dt.Rows[i][1].ToString().Trim())
                {
                    case "车载视频":
                         newRow["DevType"] = "1";
                        break;
                    case "对讲机":
                          newRow["DevType"] = "2";
                        break;
                    case "拦截仪":
                            newRow["DevType"] = "3";
                        break;
                    case "警务通":
                            newRow["DevType"] = "4";
                        break;
                    case "执法记录仪":
                            newRow["DevType"] = "5";
                        break;
                    default :
                        errtb.Rows.Add(new object[] { "错误" , "导入的EXCEL第"+(i).ToString()+"行 ["+dt.Rows[i][1].ToString().TrimEnd() + "]该设备类型不存在" }); 
                        for (int hcoloms = 0; hcoloms < 11; hcoloms++)
                       {
                        sheet.Rows[errRows + 1].Cells[hcoloms].Value = dt.Rows[i][hcoloms].ToString();
                        }
                        sheet.Rows[errRows + 1].Cells[11].Value = "该设备类型不存在";
                       errRows += 1;
                       continue;
                   
                }

                newRow["bz"] = "add"; //新增还是修改
                for (int idtdevices = 0; idtdevices < dtdevices.Rows.Count; idtdevices++)
                {
                    if (dtdevices.Rows[idtdevices]["DevId"].ToString().TrimEnd() == dt.Rows[i][2].ToString().TrimEnd())
                    {
                        newRow["bz"] = "update"; //设备ID的记录存在即修改
                        break;
                    }
                }


                try { 
                newRow["DevId"] = dt.Rows[i][2].ToString().TrimEnd();
                newRow["Cartype"] = dt.Rows[i][3].ToString().TrimEnd();
                newRow["PlateNumber"] = dt.Rows[i][4].ToString().TrimEnd();
                newRow["Contacts"] = dt.Rows[i][5].ToString().TrimEnd();
                newRow["IMEI"] = dt.Rows[i][6].ToString().TrimEnd();
                newRow["Tel1"] = dt.Rows[i][7].ToString().TrimEnd();
                newRow["SIMID"] = dt.Rows[i][8].ToString().TrimEnd();
                newRow["IdentityNum"] = dt.Rows[i][9].ToString().TrimEnd();
                newRow["IdentityPosition"] = dt.Rows[i][10].ToString().TrimEnd();
                rstb.Rows.Add(newRow);
                    }
                catch (Exception e)
                {
                    errtb.Rows.Add(new object[] { null, (i + 1).ToString(), e.ToString() }); 

                }

            }

          
                string sbSQL;
                int updatecount = 0;
                int addcount = 0;
                for (int i = 0; i < rstb.Rows.Count; i++)
                {
                    SqlParameter[] sp = new SqlParameter[11];
                    sp[0] = new SqlParameter("@DevId", rstb.Rows[i]["DevId"]);
                    sp[1] = new SqlParameter("@EntityId", rstb.Rows[i]["EntityId"]);
                    sp[2] = new SqlParameter("@Contacts", rstb.Rows[i]["Contacts"]);
                    sp[3] = new SqlParameter("@Tel", rstb.Rows[i]["Tel1"]);
                    sp[4] = new SqlParameter("@PlateNumber", rstb.Rows[i]["PlateNumber"]);
                    sp[5] = new SqlParameter("@DevType", rstb.Rows[i]["DevType"]);
                    sp[6] = new SqlParameter("@addszCartype", rstb.Rows[i]["Cartype"]);
                    sp[7] = new SqlParameter("@IdentityNum", rstb.Rows[i]["IdentityNum"]);
                    sp[8] = new SqlParameter("@SIMID", rstb.Rows[i]["SIMID"]);
                    sp[9] = new SqlParameter("@IMEI", rstb.Rows[i]["IMEI"]);
                    sp[10] = new SqlParameter("@IdentityPosition", rstb.Rows[i]["IdentityPosition"]);

                    if (rstb.Rows[i]["bz"] == "add")
                    {
                        sbSQL=("INSERT INTO  [Device] ([EntityId],[DevType],[DevId],[PlateNumber],[Contacts],[Tel1],[Cartype],[UserNum],[SIMID],[IdentityNum],[IMEI],[IdentityPosition]) VALUES ( @EntityId,@DevType,@DevId,@PlateNumber,@Contacts,@Tel,@addszCartype,@PlateNumber,@SIMID,@IdentityNum,@IMEI,@IdentityPosition) ");
                        SQLHelper.ExecuteNonQuery(CommandType.Text, sbSQL, sp);
                        addcount += 1;
                    }
                    else
                    {
                        sbSQL = ("UPDATE  [Device] set [EntityId]=@EntityId,[DevType]=@DevType,[PlateNumber]=@PlateNumber,[Contacts]=@Contacts,[Tel1]=@Tel,[Cartype]=@addszCartype,[UserNum]=@PlateNumber,[SIMID]=@SIMID,[IdentityNum]=@IdentityNum,[IMEI]=@IMEI,[IdentityPosition]=@IdentityPosition where [DevId]=@DevId");
                        SQLHelper.ExecuteNonQuery(CommandType.Text, sbSQL, sp);
                        updatecount += 1;
                    }

                    sp = null;
                }

              

                errtb.Rows.Add(new object[] { "新增", "成功导入合计：" + addcount + "条" });
                errtb.Rows.Add(new object[] { "更新", "成功导入合计：" + updatecount + "条" });


                if (errRows > 0)
                {
                    context.Response.Write(JSON.DatatableToDatatableJS(errtb, "error"));
                    tmpath = HttpContext.Current.Server.MapPath("upload\\导入失败列表.xls");
                    excelFile.SaveXls(tmpath);
                }
               else{
                   context.Response.Write(JSON.DatatableToDatatableJS(errtb, "success"));
                
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