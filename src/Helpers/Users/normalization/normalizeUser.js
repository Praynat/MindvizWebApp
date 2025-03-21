const normalizeUser = (user) => ({
  name: {
    first: user.first,
    middle: user.middle || "",
    last: user.last,
  },
  phone: user.phone,
  email: user.email,
  password: user.password,
  image: {
    url: user.url || "",
    alt: user.alt || "",
  },
  address: {
    state: user.state || "",
    country: user.country,
    city: user.city,
    street: user.street,
    houseNumber: user.houseNumber,
    zip: user.zip,
  },
  role: user.isBusiness ? "Business" : "Normal",
});

  
  export default normalizeUser;