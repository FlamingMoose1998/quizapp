// generic object validator
function ObjectValidator(obj, id) {
  const valRes = ValidationResult();

  return {
    check,

    isString,
    isNumber,
    isBoolean,
    isArray,
    isCustom,

    getResult,
  }


  function check(checkType, key, autoFix) {
    const result = {
      id,
      key,
      checkType,
      autoFix: false,
      value: obj[key],
    }

    result.valid = isValid(checkType, key);

    if (result.valid) {
      return result;
    }

    // we're only here if the object was invalid
    if (typeof autoFix === 'function') {
      autoFix(obj, key, id)
      result.valid = isValid(checkType, key);
      result.autoFix = true;
      result.value = obj[key];
    }

    return result;
  }

  function isValid(checkType, key) {
    switch (checkType) {
      case 'type-string':
        return typeof obj[key] === 'string' && obj[key] !== '';
      case 'type-number':
        return typeof obj[key] === 'number';
      case 'type-boolean':
        return typeof obj[key] === 'boolean';
      case 'type-array':
        return Array.isArray(obj[key]);
      default:
        return false;
    }
  }

  function isString(key, autoFix) {
    valRes.add(check('type-string', key, autoFix));
    return this;
  }

  function isNumber(key, autoFix) {
    valRes.add(check('type-number', key, autoFix));
    return this;
  }

  function isBoolean(key, autoFix) {
    valRes.add(check('type-boolean', key, autoFix));
    return this;
  }

  function isArray(key, autoFix) {
    valRes.add(check('type-array', key, autoFix));
    return this;
  }

  async function isCustom(checkFunction, { value }) {
    const valid = await checkFunction(obj, id);

    valRes.add({
      id,
      checkType: 'custom',
      autoFix: false,
      valid,
      value,
    })

    return this;
  }

  function getResult() {
    return valRes;
  }
}

// validation result, stores a list of check results
// exposes various functions to query the result of the list
function ValidationResult(list = []) {
  return {
    add,
    isValid,
    usedAutoFix,
    getList,
    merge,
    getResult,
    getResultsById,
  }

  function add(check) {
    list.push(check);
    return list;
  }

  function isValid() {
    return list.every(check => check.valid);
  }

  function usedAutoFix(){
    return list.some(check => check.autoFix)
  }

  function getList() {
    return list;
  }

  function merge(addResult) {
    list = [...list, ...addResult.getList()];
    return list;
  }

  function getResult() {
    return {
      valid: isValid(),
      autoFix: usedAutoFix(),
      checkList: getList(),
    }
  }

  function getResultsById() {
    const resultsById = {};
    list.forEach(check => {
      if (!resultsById[check.id]) {
        resultsById[check.id] = [];
      }
      resultsById[check.id].push(check);
    })
    return resultsById;
  }

}

export {
  ObjectValidator,
  ValidationResult,
}