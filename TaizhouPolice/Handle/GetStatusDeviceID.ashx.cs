using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace TaizhouPolice.Handle
{
    /// <summary>
    /// GetStatusDeviceID 的摘要说明
    /// </summary>
    public class GetStatusDeviceID : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            SqlParameter[] sp = new SqlParameter[3];
            sp[0] = new SqlParameter("@DevicesID", context.Request.Form["DevicesID"]);
            sp[1] = new SqlParameter("@starttime", context.Request.Form["starttime"]);
            sp[2] = new SqlParameter("@endtime", context.Request.Form["endtime"]);
            Int32 idays = Int32.Parse(context.Request.Form["iDays"]);
            string sql =  "SELECT [Time],[OnlineTime]/60 as OnlineTime,[HandleCnt],de.Contacts,de.[DevType] FROM [EverydayInfo] as gps left join Device de on de.DevId = gps.DevId  where [Time]>=@starttime and  [Time]<=@endtime and de.[DevId]=@DevicesID order by [Time]";
            if (idays > 20)
            {
                sql = "SELECT convert(nvarchar(7),[Time],111) as Time ,sum([OnlineTime])/60 as OnlineTime FROM [EverydayInfo]  where [Time]>=@starttime and  [Time]<=@endtime and [DevId]=@DevicesID group by convert(nvarchar(7),[Time],111)  order by [Time]";
            }


            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sql, "entity", sp);
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