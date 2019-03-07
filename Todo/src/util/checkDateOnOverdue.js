import moment from 'moment';

const isDateOverdue = date => {
  const todayDate = moment(new Date()).format("YYYY-MM-DD.");

  return moment(todayDate).isAfter(date);
};

export default isDateOverdue;
