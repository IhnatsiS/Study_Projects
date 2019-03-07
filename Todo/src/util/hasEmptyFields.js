import isEmpty from 'lodash';

const hasEmptyFields = obj => {

  for (let prop in obj) {

    if (isEmpty(obj[prop])) {
      return true;
    }
  }

  return false;
};

export default hasEmptyFields;
