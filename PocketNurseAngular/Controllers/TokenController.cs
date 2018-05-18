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
            const string filePath = @"Patients.txt";
            if(patients == null || patients.Length < 1 || patients.Any(p => string.IsNullOrWhiteSpace(p)))
            {
                if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath);
                return;
            }
            System.IO.File.WriteAllLines(filePath, patients);
            return;
        }
        [Route("MedicationOrder")]
        [HttpPost]
        public void MedicationOrder([FromBody]string[] medorders)
        {
            const string filePath = @"MedicationOrders.txt";
            if(medorders == null || medorders.Length < 1 || medorders.Any(m => string.IsNullOrWhiteSpace(m)))
            {
                if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath);
                return;
            }
            System.IO.File.WriteAllLines(filePath, medorders);
            return;
        }
        [Route("Item")]
        [HttpPost]
        public void Item([FromBody]string[] items)
        {
            const string filePath = @"Items.txt";
            if(items == null || items.Length < 1 || items.Any(i => string.IsNullOrWhiteSpace(i)))
            {
                if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath);
                return;
            }
            System.IO.File.WriteAllLines(filePath, items);
            return;
        }       
    }
}
