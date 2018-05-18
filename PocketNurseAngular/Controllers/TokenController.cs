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
        public IActionResult Patient(string patients)
        {
            if(string.IsNullOrWhiteSpace(patients))
            {
                return BadRequest();
            }
            return Ok();
        }
        [Route("MedicationOrder")]
        [HttpPost]
        public IActionResult MedicationOrder(string medorders)
        {
            if(string.IsNullOrWhiteSpace(medorders))
            {
                return BadRequest();
            }
            return Ok();
        }
        [Route("Item")]
        [HttpPost]
        public IActionResult Item(string items)
        {
            if(string.IsNullOrWhiteSpace(items))
            {
                return BadRequest();
            }
            return Ok();
        }       
    }
}
