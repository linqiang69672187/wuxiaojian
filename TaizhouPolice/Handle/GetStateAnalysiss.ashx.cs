﻿using DbComponent;
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
    /// GetStateAnalysiss 的摘要说明
    /// </summary>
    public class GetStateAnalysiss : IHttpHandler
    {


     
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string type = context.Request.Form["type"];
            string begintime = context.Request.Form["begintime"];
            string endtime = context.Request.Form["endtime"];
            string hbbegintime = context.Request.Form["hbbegintime"];
            string hbendtime = context.Request.Form["hbendtime"];
            string ssdd = context.Request.Form["ssdd"];
            string sszd = context.Request.Form["sszd"];
            string tmpDevid = "";
            int tmpRows = 0;
            //typetext: typetext, ssddtext: ssddtext, sszdtext: sszdtext,
           // endtime = "2017/9/14"; //测试使用
             string title ="" ;
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

            DataTable dtreturns = new DataTable(); //返回数据表

            switch (type)
            {
                case "1": //车载视频
                case "2":  //对讲机
                case "3":  //拦截仪
                case "5":  //执法记录仪
                    goto 车载视频;
                 
                case "4":

                    goto 警务通;
                  
                default:
                    goto end;

            }



            车载视频: 

            #region 车载视频逻辑
            int days = Convert.ToInt16(context.Request.Form["days"]);
            int statusvalue = 10;  //正常参考值
            int devicescount = 0;  //汇总设备总数
            int contactscount = 0;  //汇总警员数量
            double zxsc = 0.0;  //汇总在线时长
            double spdx = 0.0;  //汇总视频大小
            int allstatu_device = 0;  //汇总使用率不为空数量
            int hballstatu_device = 0;  //汇总环比使用率不为空数量
            int hbdevicescount = 0;  //汇总环比设备总数
            string ddtitle;//大队标题

            dtreturns.Columns.Add("序号");
            dtreturns.Columns.Add("所属大队");
            dtreturns.Columns.Add("所属中队");
            dtreturns.Columns.Add("警员人数");
            dtreturns.Columns.Add("设备配发数");
            dtreturns.Columns.Add("在线时长");
            dtreturns.Columns.Add("设备使用率");
            dtreturns.Columns.Add("视频大小");

            if (days > 31) //季度
            {
                statusvalue = 120;
            }
            else if (days > 7) //季度
            {
                statusvalue = 40;
            }
            else
            {
                statusvalue = 10;
            }
            DataTable dtEntity = null;  //单位信息表
            DataTable Alarm_EveryDayInfo = null; //每日告警
       
            DataTable hbAlarm_EveryDayInfo = null; //历史记录表

        
            //所有大队
            if (ssdd == "all")
            {
              
                ddtitle = "台州交警局";
                Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.[ParentID],de.[Contacts],de.[DevId],ala.在线时长,ala.[AlarmType] from (SELECT [DevId],[AlarmType],sum([Value]) as 在线时长 from [Alarm_EveryDayInfo]   where [AlarmType] in (1,3,4) and  [AlarmDay ] >='" + begintime + "' and [AlarmDay ] <='" + endtime + "'   group by [DevId],[AlarmType] ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[ID] = de.[EntityId] where de.[DevType]=" + type, "Alarm_EveryDayInfo");
              //  hbAlarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.[ParentID],de.[Contacts],de.[DevId],ala.在线时长 from (SELECT [DevId]  ,sum([Value]) as 在线时长 from [Alarm_EveryDayInfo]   where [AlarmType] = 1 and  [AlarmDay ] >='" + hbbegintime + "' and [AlarmDay ] <='" + hbendtime + "'   group by [DevId] ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[ID] = de.[EntityId] where de.[DevType]=1", "Alarm_EveryDayInfo");

                switch (type)
                {
                    case "1": //车载视频
                    case "2":  //对讲机
                    case "3":  //拦截仪
                        dtEntity = SQLHelper.ExecuteRead(CommandType.Text, "SELECT [ID] ,[Name] ,[ParentID],[Depth] from [Entity] where [Depth] = 2 and id <> 42 and id <>43  and id <> 51 order by sort", "2");
                        break;
                    case "5":  //执法记录仪
                        dtEntity = SQLHelper.ExecuteRead(CommandType.Text, "SELECT [ID] ,[Name] ,[ParentID],[Depth] from [Entity] where [Depth] = 2 and id <> 42 and id <>43  order by sort", "2");

                        break;

                   


                }
 
               
            }
            else
            {
                if (sszd == "all")
                {
                    ddtitle = context.Request.Form["ssddtext"];
                    Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + ssdd + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM [Entity] A,childtable b where a.[ParentID] = b.[ID]) SELECT convert(nvarchar(10),en.[ID]) as ParentID,de.[Contacts],de.[DevId],[AlarmType],ala.在线时长 from (SELECT [DevId],[AlarmType]  ,sum([Value]) as 在线时长 from [Alarm_EveryDayInfo]   where [AlarmType]  in (1,3,4) and  [AlarmDay ] >='" + begintime + "' and [AlarmDay ] <='" + endtime + "'   group by [DevId],[AlarmType]  ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[ID] = de.[EntityId] where de.[DevType]=" + type + " and de.EntityId in (select ID from childtable) ", "Alarm_EveryDayInfo");
                 //   hbAlarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + ssdd + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM [Entity] A,childtable b where a.[ParentID] = b.[ID])SELECT convert(nvarchar(10),en.[ID]) as ParentID,de.[Contacts],de.[DevId],ala.在线时长 from (SELECT [DevId]  ,sum([Value]) as 在线时长 from [Alarm_EveryDayInfo]   where [AlarmType] = 1 and  [AlarmDay ] >='" + hbbegintime + "' and [AlarmDay ] <='" + hbendtime + "'   group by [DevId] ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[ID] = de.[EntityId] where de.[DevType]=1 and de.EntityId in (select ID from childtable)", "Alarm_EveryDayInfo");
                    dtEntity = SQLHelper.ExecuteRead(CommandType.Text, "SELECT [ID] ,[Name] ,[ParentID],[Depth] from [Entity] where [ParentID] =  " + ssdd + "   order by sort", "2");
                }
                else
                {
                    ddtitle = context.Request.Form["sszdtext"];
                    Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT de.Contacts as ParentID ,al.[AlarmType],sum([Value]) as 在线时长,de.[DevId] from [Alarm_EveryDayInfo] al left join [Device] de on de.[DevId] = al.[DevId]  where al.[AlarmType] in  (1,3,4) and  al.[AlarmDay ] >='" + begintime + "' and [AlarmDay ] <='" + endtime + "' and  de.[DevType]=" + type + "  and  de.[EntityId]=" + sszd + " group by de.[Contacts],de.[DevId],[AlarmType] ", "Alarm_EveryDayInfo");
                 //   hbAlarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT de.Contacts as ParentID ,sum([Value]) as 在线时长 from [Alarm_EveryDayInfo] al left join [Device] de on de.[DevId] = al.[DevId]  where al.[AlarmType] = 1 and  al.[AlarmDay ] >='" + hbbegintime + "' and [AlarmDay ] <='" + hbendtime + "' and de.[DevType]=" + type + " and  de.[EntityId]=" + sszd + " group by de.[Contacts],de.[DevId]", "Alarm_EveryDayInfo");
                    dtEntity = SQLHelper.ExecuteRead(CommandType.Text, "SELECT distinct [Contacts] as ID,' /' as Name  from [Device] where [EntityId] = " + sszd + " and [DevType]=" + type + "", "2");

                }
            }
           
   
                for (int i1 = 0; i1 < dtEntity.Rows.Count; i1++)
                {
                    DataRow dr=dtreturns.NewRow();

                    dr["序号"] = (i1+1).ToString();
                    dr["所属大队"] = dtEntity.Rows[i1]["Name"].ToString();
                    dr["所属中队"] = dtEntity.Rows[i1]["Name"].ToString();
                    Int64 在线时长 = 0;
                    Int64 视频大小 = 0;
                    int status = 0;//设备使用正常、周1次，月4次，季度12次
                    var  rows= from p in Alarm_EveryDayInfo.AsEnumerable()
                                   where (p.Field<string>("ParentID") == dtEntity.Rows[i1]["ID"].ToString())
                                   orderby p.Field<string>("DevId") 
                                   select p;
                 
                    

                    //获得设备数量，及正常使用设备
                    tmpRows = 0;
                    foreach (var item in rows)
                    {
                       if (item["在线时长"] is  DBNull){}
                        else{

                            switch (item["AlarmType"].ToString())
                            {
                                case "1":
                                case "3":
                                    在线时长 += Convert.ToInt32(item["在线时长"]);
                                    break;
                                case "4":
                                    视频大小 += Convert.ToInt32(item["在线时长"]);
                                    break;
                            }
                            if (item["DevId"].ToString() != tmpDevid)
                            {
                                tmpRows += 1;  //新设备ID不重复
                                tmpDevid = item["DevId"].ToString();
                                status += (Convert.ToInt32(item["在线时长"]) / statusvalue >= 1) ? 1 : 0;
                                allstatu_device += (Convert.ToInt32(item["在线时长"]) / statusvalue >= 1) ? 1 : 0;
                            }
                       
                       }

                       
                    }

                    //或警员数量
                    if (sszd == "all")
                    {
                        var q = from pcontacts in Alarm_EveryDayInfo.AsEnumerable()
                                where (pcontacts.Field<string>("ParentID") == dtEntity.Rows[i1]["ID"].ToString())
                                group pcontacts by new { t1 = pcontacts.Field<string>("Contacts") }
                                    into g
                                    select new { name = g.Key.t1 };

                        dr["警员人数"] = q.Count();
                        contactscount += q.Count();
                    }
                    else
                    {
                        dr["警员人数"] = dtEntity.Rows[i1]["ID"].ToString();
                        contactscount +=1;
                    }


                    int countdevices = tmpRows;

                    double deviceuse = (double)status * 100 / (double)countdevices;

                     dr["设备配发数"] = countdevices;
                     devicescount += countdevices;

                     dr["在线时长"] = ((double)在线时长 / 3600).ToString("0.00");
                     dr["视频大小"] = ((double)视频大小 / 1024).ToString("0.00");
                      zxsc +=(double)在线时长 / 3600;
                      spdx += (double)视频大小 / 1024;
                     dr["设备使用率"] = (countdevices != 0) ? (deviceuse).ToString("0.00") + "%" : "-";
             
                  

                    // int hbstatus = 0;//环比设备使用正常、周1次，月4次，季度12次

                     //var hbrows = from hbp in hbAlarm_EveryDayInfo.AsEnumerable()
                     //           where (hbp.Field<string>("ParentID") == dtEntity.Rows[i1]["ID"].ToString())
                     //           select hbp;
                     //foreach (var item in hbrows)
                     //{
                     //    if (item["在线时长"] is DBNull) { }
                     //    else
                     //    {
                     //       在线时长 += Convert.ToInt32(item["在线时长"]);
                     //       hbstatus += (Convert.ToInt32(item["在线时长"]) / statusvalue >= 1) ? 1 : 0;
                     //       hballstatu_device += (Convert.ToInt32(item["在线时长"]) / statusvalue >= 1) ? 1 : 0;
                     //    }

                     //}

                    // int hbcountdevices = hbrows.Count(); //环比设备总数
                     //hbdevicescount += hbcountdevices;
                   //  double hbdeviceuse = (double)hbstatus * 100 / (double)hbcountdevices; ;
                  //   string hb = (((deviceuse / hbdeviceuse) - 1) * 100).ToString("0.0") + "%";
                   //  dr["环比"] = (hb.Contains("数字")) ? "-" : hb;
                     dtreturns.Rows.Add(dr);
                }


               // double hbhuizong = (double)hballstatu_device / (double)hbdevicescount;
               // double huizong = (double)allstatu_device/  (double)devicescount;
             //   string hbhb = (((hbhuizong / huizong) - 1) * 100).ToString("0.0") + "%";
                DataRow drtz = dtreturns.NewRow();
                drtz["序号"] = "汇总";
                drtz["所属大队"] = ddtitle;
                drtz["所属中队"] = "/";
                drtz["警员人数"] = contactscount;
                drtz["设备配发数"] = devicescount;
                drtz["在线时长"] = zxsc.ToString("0.00");
                drtz["视频大小"] = spdx.ToString("0.00");
                string sbsyl = ((double)allstatu_device * 100 / devicescount).ToString("0.00")+ "%";;
                drtz["设备使用率"] = (sbsyl.Contains("数字")) ? "-" : sbsyl; 
               // drtz["环比"] = (hbhb.Contains("数字")) ? "-" : hbhb;
                dtreturns.Rows.InsertAt(drtz, 0);

                goto end;
                #endregion

            警务通:

                dtreturns.Columns.Add("单位名称");
                dtreturns.Columns.Add("警员数");
                dtreturns.Columns.Add("移动警务配发数量");
                dtreturns.Columns.Add("移动警务处罚数今年");
                dtreturns.Columns.Add("移动警务处罚数去年");
                dtreturns.Columns.Add("移动警务处罚数同比");
                dtreturns.Columns.Add("移动警务处罚占比今年");
                dtreturns.Columns.Add("移动警务处罚占比去年");
                dtreturns.Columns.Add("移动警务处罚占比同比");
                dtreturns.Columns.Add("机器平均今年");
                dtreturns.Columns.Add("机器平均去年");
                dtreturns.Columns.Add("机器平均去年同比");
                dtreturns.Columns.Add("人均今年");
                dtreturns.Columns.Add("人均去年");
                dtreturns.Columns.Add("人均去年同比");

           
                DataTable Alarm_EveryMonthInfo = null; //每月告警

                DataTable hbAlarm_EveryMonthInfo = null; //历史每月记录表
                string[] sbdate = begintime.Split(new char[1] { '/'});
                string[] sedate = endtime.Split(new char[1] { '/' });
                int bdate = Convert.ToInt32(sbdate[0] + sbdate[1]);
                int edate = Convert.ToInt32(sedate[0] + sedate[1]);

                string[] shbbdate = hbbegintime.Split(new char[1] { '/' });
                string[] shbedate = hbendtime.Split(new char[1] { '/' });
                int hbbdate = Convert.ToInt32(shbbdate[0] + shbbdate[1]);
                int hbedate = Convert.ToInt32(shbedate[0] + shbedate[1]);


                //所有大队
                if (ssdd == "all")
                {

                    Alarm_EveryMonthInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT [UId],[DevType],st.[UserCount],[HandleCount],[DevCount],[Month],en.Name,DevCount FROM [StatementAnalysis] st inner join  Entity en on convert(varchar,en.ID) = st.UId where  st.Month >= " + bdate + " and st.Month <= " + edate + " and (en.Depth = 1 or en.Depth = 2) and en.id<>51 and [DevType]=" + type + "  order by en.Sort", "Alarm_EveryDayInfo");
                    hbAlarm_EveryMonthInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT [UId],[DevType],st.[UserCount],[HandleCount],[DevCount],[Month],en.Name,DevCount FROM [StatementAnalysis] st inner join  Entity en on convert(varchar,en.ID) = st.UId where  st.Month >= " + hbbdate + " and st.Month <= " + hbedate + " and (en.Depth = 1 or en.Depth = 2) and en.id<>51 and [DevType]=" + type, "Alarm_EveryDayInfo");
                    goto jwttable;
                }

                if (sszd == "all")
                {

                    Alarm_EveryMonthInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT [UId],[DevType],st.[UserCount],[HandleCount],[DevCount],[Month],en.Name,DevCount FROM [StatementAnalysis] st inner join  Entity en on convert(varchar,en.ID) = st.UId where  st.Month >= " + bdate + " and st.Month <= " + edate + " and (en.[ID] = " + ssdd + " or en.[ParentID] = " + ssdd + ") and [DevType]=" + type + " order by en.Sort", "Alarm_EveryDayInfo");
                    hbAlarm_EveryMonthInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT [UId],[DevType],st.[UserCount],[HandleCount],[DevCount],[Month],en.Name,DevCount FROM [StatementAnalysis] st inner join  Entity en on convert(varchar,en.ID) = st.UId where  st.Month >= " + hbbdate + " and st.Month <= " + hbedate + " and (en.[ID] = " + ssdd + " or en.[ParentID] = " + ssdd + ") and [DevType]=" + type, "Alarm_EveryDayInfo");
                    
                    goto jwttable;
                }

                Alarm_EveryMonthInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT [UId],[DevType],st.[UserCount],[HandleCount],[DevCount],[Month],en.Name,DevCount FROM [StatementAnalysis] st inner join  (SELECT de.Contacts,Contacts as Name,Sort FROM [Entity] en  inner join Device  de on de.EntityId = en.ID where en.ID =" + sszd + " and de.[DevType] = 4  union SELECT  convert(varchar,[ID]),Name,Sort  FROM [Entity] where ID = " + sszd + ") as en on st.UId=en.Contacts where  st.Month >= " + bdate + " and st.Month <= " + edate + " and [DevType]=" + type + " order by en.Sort", "Alarm_EveryDayInfo");
                hbAlarm_EveryMonthInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT [UId],[DevType],st.[UserCount],[HandleCount],[DevCount],[Month],en.Name,DevCount FROM [StatementAnalysis] st inner join  (SELECT de.Contacts,Contacts as Name,Sort FROM [Entity] en  inner join Device  de on de.EntityId = en.ID where en.ID =" + sszd + " and de.[DevType] = 4  union SELECT  convert(varchar,[ID]),Name,Sort  FROM [Entity] where ID = " + sszd + ") as en on st.UId=en.Contacts where  st.Month >= " + hbbdate + " and st.Month <= " + hbedate + " and [DevType]=" + type + " order by en.Sort", "Alarm_EveryDayInfo");
                    


                jwttable:
                for (int i1 = 0; i1 < Alarm_EveryMonthInfo.Rows.Count; i1++)
                {
                    DataRow dr = dtreturns.NewRow();

                    dr["单位名称"] = Alarm_EveryMonthInfo.Rows[i1]["Name"].ToString();
                    dr["警员数"] = Alarm_EveryMonthInfo.Rows[i1]["UserCount"].ToString();
                    dr["移动警务配发数量"] = Alarm_EveryMonthInfo.Rows[i1]["DevCount"].ToString();
                    dr["移动警务处罚数今年"] = Alarm_EveryMonthInfo.Rows[i1]["HandleCount"].ToString();
                    dr["移动警务处罚占比今年"] = "";
                    dr["移动警务处罚占比去年"] = "";
                    dr["移动警务处罚占比同比"] = "";

                    string devconver = (Alarm_EveryMonthInfo.Rows[i1]["DevCount"].ToString() == "0") ? "-" : ((double)Convert.ToInt32(Alarm_EveryMonthInfo.Rows[i1]["HandleCount"].ToString()) / (double)Convert.ToInt32(Alarm_EveryMonthInfo.Rows[i1]["DevCount"].ToString())).ToString("0.0");
                    dr["机器平均今年"] = devconver;
                    string userconver = (Alarm_EveryMonthInfo.Rows[i1]["UserCount"].ToString() == "0") ? "-" : ((double)Convert.ToInt32(Alarm_EveryMonthInfo.Rows[i1]["HandleCount"].ToString()) / (double)Convert.ToInt32(Alarm_EveryMonthInfo.Rows[i1]["UserCount"].ToString())).ToString("0.0");
                    dr["人均今年"] = userconver;

                    var rows = from p in hbAlarm_EveryMonthInfo.AsEnumerable()
                               where (p.Field<string>("UId") == Alarm_EveryMonthInfo.Rows[i1]["UId"].ToString())
                               select p;
                    if (rows.Count() == 0) { 
                        dr["移动警务处罚数去年"] ="-";
                        dr["移动警务处罚数同比"]="-";
                        dr["机器平均去年"]="-";
                        dr["机器平均去年同比"]="-";
                        dr["人均去年"]="-";
                        dr["人均去年同比"] = "-";
                    }
                    foreach (var item in rows)
                    {
                        if (item["HandleCount"] is DBNull) { }
                        else
                        {
                            dr["移动警务处罚数去年"] = item["HandleCount"].ToString();
                            dr["移动警务处罚数同比"] = (item["HandleCount"].ToString() == "0") ? "-" : (((double)Convert.ToInt32(Alarm_EveryMonthInfo.Rows[i1]["HandleCount"].ToString()) / (double)Convert.ToInt32(item["HandleCount"].ToString())-1)*100).ToString("0.00")+"%";

                            string hbdevconver = (item["DevCount"].ToString() == "0") ? "-" : ((double)Convert.ToInt32(item["HandleCount"].ToString()) / (double)Convert.ToInt32(item["DevCount"].ToString())).ToString("0.0");
                            dr["机器平均去年"] = hbdevconver;
                            dr["机器平均去年同比"] = (hbdevconver == "0.0" || hbdevconver == "-" || devconver == "-") ? "-" : (((double)Convert.ToDouble(devconver) / (double)Convert.ToDouble(hbdevconver) - 1) * 100).ToString("0.00") + "%";

                            string hbuserconver = (item["UserCount"].ToString() == "0") ? "-" : ((double)Convert.ToInt32(item["HandleCount"].ToString()) / (double)Convert.ToInt32(item["UserCount"].ToString())).ToString("0.0");
                            dr["人均去年"] = hbuserconver;
                            dr["人均去年同比"] = (hbuserconver == "0.0" || hbuserconver == "-" || userconver == "-" ) ? "-" :  (((double)Convert.ToDouble(userconver) / (double)Convert.ToDouble(hbuserconver) - 1) * 100).ToString("0.00") + "%";



                        
                        }

                    }


                    dtreturns.Rows.Add(dr);


                }


            end:


                string reTitle = ExportExcel(dtreturns, type, begintime, endtime, title, ssdd, sszd, context.Request.Form["ssddtext"], context.Request.Form["sszdtext"]);
            context.Response.Write(JSON.DatatableToDatatableJS(dtreturns, reTitle));
        }



        public string ExportExcel(DataTable dt, string type, string begintime, string endtime, string entityTitle, string ssdd, string sszd, string ssddtext, string sszdtext)
        {
            ExcelFile excelFile = new ExcelFile();


            var tmpath = HttpContext.Current.Server.MapPath("templet\\" + type + ".xls");
            excelFile.LoadXls(tmpath);
            ExcelWorksheet sheet = excelFile.Worksheets[0];

           
            DateTime bg = Convert.ToDateTime(begintime);
            DateTime ed = Convert.ToDateTime(endtime);
            int days = (ed - bg).Days;
            string title = "";

            if (days >= 190) //季度
            {
                title =  bg.Year.ToString()+"年";
            }
            else if (days > 100 && days < 190) //季度
            {
                if (bg.Month >=6 )
                {
                    title = "下半年";
                }
                else
                {
                    title = "上半年";
                }
                title = bg.Year.ToString()+"年"+ title;
            }
            else if (days > 31&&days<100) //季度
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
            else if (days <=7) //周
            {
                title = begintime.Replace("/", "-") + "_" + endtime.Replace("/", "-"); 
            }

          

        
              switch (type)
              {
               case "1":
                      sheet.Rows[0].Cells[0].Value = title + entityTitle + "车载视频在线时长报表";
               for (int i = 0; i < dt.Rows.Count; i++)
                   {
                    sheet.Rows[i+2].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                    if (i == 0) {
                        sheet.Rows[i + 2].Cells["A"].Value =  dt.Rows[i][0].ToString();
                    }
                   else
                    {
                        sheet.Rows[i + 2].Cells["A"].Value = Convert.ToInt32(dt.Rows[i][0].ToString());
                    }
                  
                    sheet.Rows[i + 2].Cells["A"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);


                 if (ssdd!="all"){
                        if (sszd != "all")
                       {
                           sheet.Rows[i + 2].Cells["B"].Value = (i != 0) ? dt.Rows[i][3].ToString() : dt.Rows[i][1].ToString();
                      
                       }
                      else
                       {
                           sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[0][1].ToString();
                          // sheet.Rows[i + 2].Cells["C"].Value = dt.Rows[i][2].ToString();
                           if (i != 0) sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                        }
                     }
                    else
                    {
                        sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                      //  sheet.Rows[i + 2].Cells["C"].Value = "/";

                    }
                    sheet.Rows[i + 2].Cells["B"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                    sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                    sheet.Rows[i + 2].Cells["C"].Value = Convert.ToInt32(dt.Rows[i][4].ToString());
                    sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                    sheet.Rows[i + 2].Cells["D"].Value = Convert.ToDouble(dt.Rows[i][5].ToString());
                    sheet.Rows[i + 2].Cells["D"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                    sheet.Rows[i + 2].Cells["E"].Value = dt.Rows[i][6].ToString();
                    sheet.Rows[i + 2].Cells["E"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                      }
               sheet.Rows[dt.Rows.Count + 2].Cells[0].Value = "计算公式：设备使用率为 （设备使用数量/设备配发数 *100%），设备使用标准为查询时间段内时长大于10分钟  ";
               sheet.Cells.GetSubrangeAbsolute(dt.Rows.Count + 2, 0, dt.Rows.Count + 2, dt.Columns.Count - 4).Merged = true;
                      break;
                  case "2":
                       sheet.Rows[0].Cells[0].Value = title + entityTitle + "对讲机在线时长报表";
                  for (int i = 0; i < dt.Rows.Count; i++)
                   {
                    sheet.Rows[i+2].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                    sheet.Rows[i + 2].Cells["A"].Value = dt.Rows[i][0].ToString();
                    sheet.Rows[i + 2].Cells["A"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);


                    if (ssdd!="all"){
                          if (sszd != "all")
                       {
                           sheet.Rows[i + 2].Cells["B"].Value = (i != 0) ? dt.Rows[i][3].ToString() : dt.Rows[i][1].ToString();

                       }
                      else
                       {
                           sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[0][1].ToString();
                           // sheet.Rows[i + 2].Cells["C"].Value = dt.Rows[i][2].ToString();
                           if (i != 0) sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                        }
                       }
                    else
                      {
                          sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();

                      }
                    sheet.Rows[i + 2].Cells["B"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                    sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                    sheet.Rows[i + 2].Cells["C"].Value = Convert.ToInt32(dt.Rows[i][4].ToString());
                    sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                    sheet.Rows[i + 2].Cells["D"].Value = Convert.ToDouble(dt.Rows[i][5].ToString());
                    sheet.Rows[i + 2].Cells["D"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                    sheet.Rows[i + 2].Cells["E"].Value = dt.Rows[i][6].ToString();
                    sheet.Rows[i + 2].Cells["E"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                      }
                  sheet.Rows[dt.Rows.Count + 2].Cells[0].Value = "计算公式：设备使用率为 （设备使用数量/设备配发数 *100%），设备使用标准为查询时间段内时长大于10分钟  ";
              sheet.Cells.GetSubrangeAbsolute(dt.Rows.Count + 2, 0, dt.Rows.Count + 2, dt.Columns.Count - 4).Merged = true;
                      break;
                  case "3":
                       sheet.Rows[0].Cells[0].Value = title + entityTitle + "拦截仪在线时长报表";
               for (int i = 0; i < dt.Rows.Count; i++)
                   {
                    sheet.Rows[i+2].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                    sheet.Rows[i + 2].Cells["A"].Value = dt.Rows[i][0].ToString();
                    sheet.Rows[i + 2].Cells["A"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);


                 if (ssdd!="all"){
                        if (sszd != "all")
                       {
                           sheet.Rows[i + 2].Cells["B"].Value = (i != 0) ? dt.Rows[i][3].ToString() : dt.Rows[i][1].ToString();

                       }
                      else
                       {
                           sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[0][1].ToString();
                           // sheet.Rows[i + 2].Cells["C"].Value = dt.Rows[i][2].ToString();
                           if (i != 0) sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                        }
                     }
                    else
                    {
                        sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                    }
                 sheet.Rows[i + 2].Cells["B"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                 sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                 sheet.Rows[i + 2].Cells["C"].Value = Convert.ToInt32(dt.Rows[i][4].ToString());
                 sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                 sheet.Rows[i + 2].Cells["D"].Value = Convert.ToDouble(dt.Rows[i][5].ToString());
                 sheet.Rows[i + 2].Cells["D"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                 sheet.Rows[i + 2].Cells["E"].Value = dt.Rows[i][6].ToString();
                 sheet.Rows[i + 2].Cells["E"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                      }
               sheet.Rows[dt.Rows.Count + 2].Cells[0].Value = "计算公式：设备使用率为 （设备使用数量/设备配发数 *100%），设备使用标准为查询时间段内时长大于10分钟  ";
              sheet.Cells.GetSubrangeAbsolute(dt.Rows.Count + 2, 0, dt.Rows.Count + 2, dt.Columns.Count - 4).Merged = true;
                      break;
                 
                  case "4":
                      sheet.Rows[0].Cells[0].Value = title + entityTitle + "移动警务通报表";
                      sheet.Rows[3].Cells["B"].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                      for (int i = 0; i < dt.Rows.Count; i++)
                      {
                          sheet.Rows[i + 3].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                          sheet.Rows[i + 3].Cells["A"].Value = i+1;
                          sheet.Rows[i + 3].Cells["A"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 3].Cells["B"].Value = dt.Rows[i][0].ToString();
                          sheet.Rows[i + 3].Cells["B"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 3].Cells["C"].Value = dt.Rows[i][1].ToString();
                          sheet.Rows[i + 3].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 3].Cells["D"].Value = dt.Rows[i][2].ToString();
                          sheet.Rows[i + 3].Cells["D"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 3].Cells["E"].Value = dt.Rows[i][3].ToString();
                          sheet.Rows[i + 3].Cells["E"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 3].Cells["F"].Value = dt.Rows[i][4].ToString();
                          sheet.Rows[i + 3].Cells["F"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 3].Cells["G"].Value = dt.Rows[i][5].ToString();
                          sheet.Rows[i + 3].Cells["G"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);


                          sheet.Rows[i + 3].Cells["H"].Value = dt.Rows[i][6].ToString();
                          sheet.Rows[i + 3].Cells["H"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 3].Cells["I"].Value = dt.Rows[i][7].ToString();
                          sheet.Rows[i + 3].Cells["I"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 3].Cells["J"].Value = dt.Rows[i][8].ToString();
                          sheet.Rows[i + 3].Cells["J"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 3].Cells["K"].Value = dt.Rows[i][9].ToString();
                          sheet.Rows[i + 3].Cells["K"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 3].Cells["L"].Value = dt.Rows[i][10].ToString();
                          sheet.Rows[i + 3].Cells["L"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 3].Cells["M"].Value = dt.Rows[i][11].ToString();
                          sheet.Rows[i + 3].Cells["M"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 3].Cells["N"].Value = dt.Rows[i][12].ToString();
                          sheet.Rows[i + 3].Cells["N"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 3].Cells["O"].Value = dt.Rows[i][13].ToString();
                          sheet.Rows[i + 3].Cells["O"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 3].Cells["P"].Value = dt.Rows[i][14].ToString();
                          sheet.Rows[i + 3].Cells["P"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                      }
              sheet.Rows[dt.Rows.Count+3].Cells[0].Value = "计算公式：设备使用率为 （设备使用数量/设备配发数 *100%），设备使用标准为查询时间段内时长大于10分钟  ";
              sheet.Cells.GetSubrangeAbsolute(dt.Rows.Count + 3, 0, dt.Rows.Count + 3, dt.Columns.Count - 1).Merged = true;
                      break;
                  case "5":
                      sheet.Rows[0].Cells[0].Value = title + entityTitle + "执法记录仪在线时长报表";
                      for (int i = 0; i < dt.Rows.Count; i++)
                      {
                          sheet.Rows[i + 2].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                          if (i == 0)
                          {
                              sheet.Rows[i + 2].Cells["A"].Value = dt.Rows[i][0].ToString();
                          }
                          else
                          {
                              sheet.Rows[i + 2].Cells["A"].Value = Convert.ToInt32(dt.Rows[i][0].ToString());
                          }

                          sheet.Rows[i + 2].Cells["A"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);


                          if (ssdd != "all")
                          {
                              if (sszd != "all")
                              {
                                  sheet.Rows[i + 2].Cells["B"].Value = (i != 0) ? dt.Rows[i][3].ToString() : dt.Rows[i][1].ToString();

                              }
                              else
                              {
                                  sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[0][1].ToString();
                                  // sheet.Rows[i + 2].Cells["C"].Value = dt.Rows[i][2].ToString();
                                  if (i != 0) sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                              }
                          }
                          else
                          {
                              sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                          }
                          sheet.Rows[i + 2].Cells["B"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                          sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 2].Cells["C"].Value = Convert.ToInt32(dt.Rows[i][4].ToString());
                          sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 2].Cells["D"].Value = Convert.ToDouble(dt.Rows[i][5].ToString());
                          sheet.Rows[i + 2].Cells["D"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 2].Cells["E"].Value = Convert.ToDouble(dt.Rows[i][7].ToString());
                          sheet.Rows[i + 2].Cells["E"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                          sheet.Rows[i + 2].Cells["F"].Value = dt.Rows[i][6].ToString();
                          sheet.Rows[i + 2].Cells["F"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                      }
                      sheet.Rows[dt.Rows.Count + 2].Cells[0].Value = "计算公式：设备使用率为 （设备使用数量/设备配发数 *100%），设备使用标准为查询时间段内视频时长大于10分钟  ";
              sheet.Cells.GetSubrangeAbsolute(dt.Rows.Count + 2, 0, dt.Rows.Count + 2, dt.Columns.Count - 3).Merged = true;
                      break;
                  default:

                      break;
              }
             

            //sheet.GetUsedCellRange(true).Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
            
              tmpath = HttpContext.Current.Server.MapPath("upload\\" + sheet.Rows[0].Cells[0].Value + ".xls");

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