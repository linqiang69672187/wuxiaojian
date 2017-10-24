using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;

namespace TaizhouPolice.Handle.Orgchart
{
    /// <summary>
    /// GetContacts 的摘要说明
    /// </summary>
    public class GetContacts : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, "SELECT de.[EntityId],de.[Contacts],gps.IsOnline  FROM [Device] as de left join  [Gps] as gps on gps.PDAID = de.DevId ", "contacts");

            DataView dataView = dt.DefaultView;
            DataTable ConDistinct = dataView.ToTable(true, "Contacts");//注：其中ToTable（）的第一个参数为是否DISTINCT 人员不同
            StringBuilder jsoncontacts = new StringBuilder();
            jsoncontacts.Append("[");
            for (int i = 0; i < ConDistinct.Rows.Count; i++)
            {
                if(i!=0){jsoncontacts.Append(",");} ;
                jsoncontacts.Append("{\"Contacts\":\""+ConDistinct.Rows[i]["Contacts"].ToString()+"\",");
                int sum = 0;
                int normal = 0;
                string EntityID="";
                for (int h = 0; h < dt.Rows.Count; h++)
                {
                    if (ConDistinct.Rows[i]["Contacts"].ToString() == dt.Rows[h]["Contacts"].ToString())
                    {
                        EntityID = dt.Rows[h]["EntityId"].ToString();
                        sum += 1;
                        if (dt.Rows[h]["IsOnline"].ToString() == "1") { normal += 1; }
                       
                    }
                }
                jsoncontacts.Append("\"EntityID\":\"" + EntityID + "\",");
               jsoncontacts.Append("\"sum\":\""+sum+"\",");
               jsoncontacts.Append("\"normal\":\""+normal+"\"");
               jsoncontacts.Append("}");
            }
            jsoncontacts.Append("]");

            context.Response.Write(jsoncontacts.ToString());
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