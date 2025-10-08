## Setup NextJS (npm, npx, packages)
- node -v (I'm using v22.19.0, didn't test if works on lower version or conflict any dependencies)
- npm -v and npx -v (both version should be the same)

Note: You don't need to make new build project using npx create-next-app@latest [project_name], cuz' I've settled what to use on this project
forgot to add, npx install pg bcryptjs jsonwebtoken zod

## Setup PHP artisan + API integration NextJS from Laravel
- php -v (check if php version still lower than 8.3), make sure to get latest packages from PHP: https://www.php.net/downloads.php
- composer --version (update to latest, latest version 2.8.12), using composer self-update to update.

### If done, then start run it:
- php artisan serve (it would show up localhost running on 8000, by default, it's Laravel port)
- copy the port URL => nextjs-project/.env/ => if .env wasn't found, that's because I used prisma for Backend Logic NextJS (just create it manual) => make NEXT_PUBLIC_API_URL variable and paste the port URL into it.

### After following all those steps, go to nextjs/src/app/(landing). I still progressing to make Guest User, but just go to /login/page.tsx
- The first thing you'll see would be this part:

      export default function Login() {
        const [formData, setFormData] = useState({
          email: '',
          password: '',
        });
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState('');
        const router = useRouter();
      
        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setIsLoading(true);
          setError('');
      
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify(formData),
            });
      
            const data = await response.json();
      
            if (response.ok) {
              // Store token in localStorage
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
              
              // Redirect to home
              router.push('/');
            } else {
              setError(data.error || 'Login failed');
            }
          } catch (error) {
            console.error(error);
            setError('An error occurred. Please try again.');
          } finally {
            setIsLoading(false);
          }
        };

- The craziest thing, is change the fetch from like /api/auth/register to `${process.env.NEXT_PUBLIC_API_URL}/login`.
- Backend logic here is that NextJS using Laravel internal server (port) that hosting on 8000, then ~/login logic from Laravel php folder that contains the connection of DB
