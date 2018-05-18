using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace PocketNurseAngular.Controllers
{
    [Route("api/Token")]
    public class TokenController : Controller
    {
        [Route("Patient")]
        [HttpPost]
        public void Patient([FromBody]string[] patients)
        {
            if(patients == null || patients.Length < 1 || patients.Any(p => string.IsNullOrWhiteSpace(p)))
            {
                return;
            }
            return;
        }
        [Route("MedicationOrder")]
        [HttpPost]
        public void MedicationOrder([FromBody]string[] medorders)
        {
            if(medorders == null || medorders.Length < 1 || medorders.Any(m => string.IsNullOrWhiteSpace(m)))
            {
                return;
            }
            return;
        }
        [Route("Item")]
        [HttpPost]
        public void Item([FromBody]string[] items)
        {
            if(items == null || items.Length < 1 || items.Any(i => string.IsNullOrWhiteSpace(i)))
            {
                return;
            }
            return;
        }       
    }
}
