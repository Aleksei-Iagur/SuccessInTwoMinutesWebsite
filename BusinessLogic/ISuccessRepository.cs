using SuccessInTwoMinutes.Controllers;
using System;

namespace SuccessInTwoMinutesWebsite.BusinessLogic
{
	public interface ISuccessRepository
	{
		SuccessRecord[] GetRecords(DateTime since, DateTime until);
	}
}