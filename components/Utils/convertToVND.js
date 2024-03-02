function convertToVND(value) {
    const vndValue = value?.toLocaleString('en-US');
    return vndValue + ' VND';
}

export default convertToVND;
