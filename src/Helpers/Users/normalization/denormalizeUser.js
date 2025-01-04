const denormalizeUser = (normalizedUser) => ({
    first: normalizedUser.name.first,
    middle: normalizedUser.name.middle,
    last: normalizedUser.name.last,
    phone: normalizedUser.phone,
    email: normalizedUser.email,
    password: normalizedUser.password,
    state: normalizedUser.address.state,
    country: normalizedUser.address.country,
    city: normalizedUser.address.city,
    street: normalizedUser.address.street,
    zip: normalizedUser.address.zip,
    houseNumber: normalizedUser.address.houseNumber,
    url: normalizedUser.image.url,
    alt: normalizedUser.image.alt,
    isBusiness: normalizedUser.isBusiness,
  });
  
  export default denormalizeUser;