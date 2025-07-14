import { useFormik } from 'formik';
import * as Yup from 'yup';

const RegisterForm = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: ''
      }
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
      phone: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number')
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post('/api/auth/register', values);
        localStorage.setItem('token', res.data.token);
        // Redirect to dashboard
      } catch (err) {
        console.error(err.response.data);
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField 
        label="Full Name"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      />
      {/* Other fields similarly */}
      <Button type="submit">Register</Button>
    </form>
  );
};