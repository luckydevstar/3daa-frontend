import isValidDate from 'is-valid-date';
import moment from 'moment';
import { _t } from 'app/intl';

function validate(_values, _errors, _field) {
  if (!(this instanceof validate)) {
    return new validate(_values, _errors, _field);
  }

  this.values = _values;
  this.errors = _errors;
  this.field = _field;

  this.matchesPassword = comparisonField => {
    if (this.values[this.field] !== this.values.password) {
      this.errors[this.field] = 'The provided passwords do not match.';
    }
    return this;
  };

  this.email = () => {
    const message = 'msg_provided_email_address';

    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(this.values[this.field])) {
      this.errors[this.field] = message;
    }
    return this;
  };

  this.url = () => {
    const regex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g;
    if (!regex.test(this.values[this.field])) {
      this.errors[this.field] = 'Provided link is invalid';
    }
    return this;
  };

  this.lettersOnly = () => {
    const regex = /^[A-Z]+$/i;
    if (!regex.test(this.values[this.field])) {
      this.errors[this.field] = 'Only letter allowed!';
    }
    return this;
  };

  this.numbersOnly = () => {
    const regex = /^\d+$/;
    if (!regex.test(this.values[this.field])) {
      this.errors[this.field] = 'Only number allowed';
    }
    return this;
  };

  this.required = () => {
    const message = 'required';
    if (
      !this.values[this.field] ||
      (typeof this.values[this.field] === String &&
        !this.values[this.field].replace(/^\s+/g, '').length)
    ) {
      this.errors[this.field] = message;
    }
    return this;
  };

  this.file = () => {
    if (
      !this.values[this.field] ||
      this.values[this.field].constructor.name !== 'FileList'
    ) {
      this.errors[this.field] = 'Input must be a file';
    }
    return this;
  };

  this.image = () => {
    if (
      !this.values[this.field] ||
      (this.values[this.field].length &&
        this.values[this.field][0].type.indexOf('image') === -1)
    ) {
      this.errors[this.field] = 'Input must be an image';
    }

    return this;
  };

  this.maxSize = limit => {
    if (
      !this.values[this.field] ||
      (this.values[this.field].length &&
        this.values[this.field][0].size > limit)
    ) {
      this.errors[this.field] = `File is too big. Max ${parseInt(
        limit / 1000 / 1000,
        0
      )}mb`;
    }
    return this;
  };

  this.video = () => {
    if (
      !this.values[this.field] ||
      (this.values[this.field].length &&
        !this.values[this.field][0].type.includes('video'))
    ) {
      this.errors[this.field] = 'Input must be a video';
    }

    return this;
  };

  this.dayNumber = () => {
    const day = parseInt(this.values[this.field]);

    if (!(day > 0 && day < 32)) {
      this.errors[this.field] = 'Need to be a valid day';
    }
    return this;
  };

  this.validDate = () => {
    if (!moment(this.values[this.field], 'YYYY-MM-D', true).isValid()) {
      this.errors[this.field] = 'Please provide valid date!';
    }

    return this;
  };

  this.twoDigit = () => {
    const regex = /^([0-9]{2})?$/;
    if (!regex.test(this.values[this.field])) {
      this.errors[this.field] = 'Need to contain 2 digits';
    }
    return this;
  };

  this.fourDigit = () => {
    const regex = /^([0-9]{4})?$/;
    if (!regex.test(this.values[this.field])) {
      this.errors[this.field] = 'Need to contain 4 digits';
    }
    return this;
  };

  this.passwordLength = () => {
    if (this.values[this.field]) {
      if (
        this.values[this.field].length < 6 ||
        this.values[this.field].length > 32
      ) {
        this.errors[this.field] =
          'Password length should be between 6 and 32 characters.';
      }
    }
    return this;
  };

  this.postCode = () => {
    const regex = /^(GIR ?0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]([0-9ABEHMNPRV-Y])?)|[0-9][A-HJKPS-UW]) ?[0-9][ABD-HJLNP-UW-Z]{2})$/;
    if (!regex.test(this.values[this.field])) {
      this.errors[this.field] = 'Please provide valid Post Code.';
    }
    return this;
  };

  this.minLength = length => {
    if (!this.values[this.field] || this.values[this.field].length < length) {
      this.errors[this.field] = `Entry needs to be longer than ${length}`;
    }
    return this;
  };

  this.length = length => {
    if (!this.values[this.field] || this.values[this.field].length !== length) {
      this.errors[this.field] = `Entry needs to be ${length} letters`;
    }
    return this;
  };

  return this;
}

function checkDate(_day, _month, _year) {
  const date = `${_day}/${_month}/${_year}`;
  if (!isValidDate(date)) {
    return false;
  }
  return true;
}

function computeDate(_day, _month, _year) {
  const date = `${_day}/${_month}/${_year}`;
  if (!isValidDate(date)) {
    return null;
  }
  return date;
}

export default {
  validate,
  checkDate,
  computeDate
};
