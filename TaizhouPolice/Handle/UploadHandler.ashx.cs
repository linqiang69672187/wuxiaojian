using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using TaizhouPolice.CommonClass;

namespace TaizhouPolice.Handle
{
    /// <summary>
    /// UploadHandler 的摘要说明
    /// </summary>
    public class UploadHandler : IHttpHandler
    {
       

        public void ProcessRequest(HttpContext context)
        {
            try { 
            context.Response.ContentType = "text/plain";
            //接收上传后的文件
            HttpPostedFile file = context.Request.Files["file"];
            //其他参数
            //string somekey = context.Request["someKey"];
            //string other = context.Request["someOtherKey"];
            string filename = DateTime.Now.ToFileTimeUtc().ToString() ;
            //获取文件的保存路径
            string uploadPath =
                HttpContext.Current.Server.MapPath("Upload" + "\\");
            //判断上传的文件是否为空
            if (file != null)
            {
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }
                //保存文件
               // file.SaveAs(uploadPath + file.FileName);
                if (File.Exists(uploadPath + filename+ ".xls"))
                {
                    File.Delete(uploadPath + filename + ".xls");
                }

                file.SaveAs(uploadPath + filename + ".xls");
                
                LogHelper.WriteLog(typeof(UploadHandler), "成功");
                context.Response.Write(filename);
            }
            else
            {
                LogHelper.WriteLog(typeof(UploadHandler), "失败");
                context.Response.Write("0");
            }
            }
            catch (Exception e)
            {
                LogHelper.WriteLog(typeof(UploadHandler), e);
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