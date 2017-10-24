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
    /// CreateOrgchart 的摘要说明
    /// </summary>
    public class CreateOrgchart : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            string sbSQL = "SELECT [ID] ,[Name] as name,[ParentID],[Depth],[PicUrl] from [Entity] where [Depth] = 1 ";
            DataTable dtfrist = SQLHelper.ExecuteRead(CommandType.Text, sbSQL, "1");

            sbSQL = "SELECT [ID] ,[Name] as name,[ParentID],[Depth],[PicUrl] from [Entity] where [Depth] = 2 order by Sort";
            DataTable dtsecond = SQLHelper.ExecuteRead(CommandType.Text, sbSQL, "2");
            int initflag = 0;
            sbSQL = "SELECT [ID] ,[Name] as name,[ParentID],[Depth],[PicUrl] from [Entity] where [Depth] = 3  order by Sort";
            DataTable dtthrid= SQLHelper.ExecuteRead(CommandType.Text, sbSQL, "3");

            StringBuilder json = new StringBuilder();
       
            for (int i1 = 0; i1 < dtfrist.Rows.Count; i1++)
            {
                json.Append("{");
                for (int i1h = 0; i1h < dtfrist.Columns.Count; i1h++)
                {
                    if (i1h != 0) json.Append(',');
                    json.Append('"');
                    json.Append(dtfrist.Columns[i1h].ColumnName);
                    json.Append('"');
                    json.Append(":");
                    json.Append('"');
                    json.Append(dtfrist.Rows[i1][dtfrist.Columns[i1h].ColumnName].ToString().TrimEnd());
                    json.Append('"');

                }



                for (int i2 = 0; i2 < dtsecond.Rows.Count; i2++)
                {
                    
                    if (i2 == 0) { json.Append(",\"children\":[{"); };
                    if (i2 != 0){
                        json.Append(',');
                        json.Append("{");
                    };

                    for (int i2h = 0; i2h < dtsecond.Columns.Count; i2h++)
                    {

                          if (i2h != 0) { json.Append(","); };
                    
                          json.Append('"');
                          json.Append(dtsecond.Columns[i2h].ColumnName);
                          json.Append('"');
                          json.Append(":");
                          json.Append('"');
                          json.Append(dtsecond.Rows[i2][dtsecond.Columns[i2h].ColumnName].ToString().TrimEnd());
                          json.Append("\"");


                    }
                    initflag = 0;
                    #region 三级节点树形开始
                     { json.Append(",\"children\":["); };
                    for (int i3 = 0; i3 < dtthrid.Rows.Count; i3++)
                     {
                       if (dtthrid.Rows[i3]["ParentID"].ToString()!=dtsecond.Rows[i2]["ID"].ToString())  //判断属于二级的子节点
                       {
                           continue;
                       }

                       if (initflag != 0)
                        {
                            json.Append(',');
                            initflag += 1;
                        };
                        json.Append("{");
                        for (int i3h = 0; i3h < dtsecond.Columns.Count; i3h++)
                        {

                            if (i3h != 0) { json.Append(","); };

                            json.Append('"');
                            json.Append(dtthrid.Columns[i3h].ColumnName);
                            json.Append('"');
                            json.Append(":");
                            json.Append('"');
                            json.Append(dtthrid.Rows[i3][dtthrid.Columns[i3h].ColumnName].ToString().TrimEnd());
                            json.Append('"');


                        }
                        json.Append("}");
                        
                     }
                     { json.Append("]"); };
                    #endregion 三级节点树形结束



                    json.Append("}");
                       if (i2 == dtsecond.Rows.Count-1) { json.Append("]"); };
                }


                json.Append("}");
            
            
            }



            context.Response.Write(json.ToString().Replace("}{","},{"));

        //    context.Response.Write("{\"name\":\"杭州公安局\",\"ID\":\"1\",\"content\":\"\",\"children\":[{\"name\":\"一大队\",\"ID\":\"2\",\"type\":\"大队\"},{\"name\":\"二大队\",\"ID\":\"3\",\"type\":\"大队\",\"children\":[{\"name\":\"1中队\",\"ID\":\"4\",\"type\":\"中队\",\"children\":[{\"name\":\"1小队\",\"ID\":\"5\",\"type\":\"小队\"},{\"name\":\"2小队\",\"ID\":\"6\",\"type\":\"小队\"}]},{\"name\":\"三大队\",\"ID\":\"7\",\"type\":\"大队\"}]},{\"name\":\"中队\",\"ID\":\"8\",\"type\":\"中队\"},{\"name\":\"四大队\",\"title\":\"9\",\"type\":\"大队\"}]}");
       
        
        }

        public void CreatTableToJson(DataTable dt)
        {



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