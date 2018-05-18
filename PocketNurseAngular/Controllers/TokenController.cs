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
        public IActionResult Patient([FromBody]string[] patients)
        {
            if(patients == null || patients.Length < 1 || patients.Any(p => string.IsNullOrWhiteSpace(p)))
            {
                return BadRequest();
            }
            return Ok();
        }
        [Route("MedicationOrder")]
        [HttpPost]
        public IActionResult MedicationOrder([FromBody]string[] medorders)
        {
            if(medorders == null || medorders.Length < 1 || medorders.Any(m => string.IsNullOrWhiteSpace(m)))
            {
                return BadRequest();
            }
            return Ok();
        }
        [Route("Item")]
        [HttpPost]
        public IActionResult Item([FromBody]string[] items)
        {
            if(items == null || items.Length < 1 || items.Any(i => string.IsNullOrWhiteSpace(i)))
            {
                return BadRequest();
            }
            return Ok();
        }       
    }
}
