import { useEffect, useState } from 'react'
import './App.css'
import { useRoutes } from 'react-router-dom'
import Home from './components/Home'
import FooterComponent from './components/FooterComponent'
import HeaderComponent from './components/HeaderComponent'
import AuthForm from './components/AuthForm'
import { supabase } from './clients/SupaBaseClient'
import CreatePostComponent from './components/CreatePostComponent'
import PostInfoComponent from './components/PostInfoComponent'
import EditPostComponent from './components/EditPostComponent'

function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState([false]);

  // Gets current user data
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await supabase.auth.getUser();
      setUser(userData?.data.user || null);
    };
  
    fetchUser();
  }, []);

  // Gets all posts 
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('Posts')           // your table name
        .select()             // get all columns
        // .order('created_at', { ascending: false }); // optional

      if (error) {  
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  console.log(user);

  let element = useRoutes([
    {
      path: "/",
      element: (
        <>
          <Home userData = {user} posts = {posts}/>
        </>
      )
    },
    {
      path: "/auth",
      element: (
        <>
          <AuthForm setUser = {setUser}/>
        </>
      )
    },
    {
      path: "/create-post",
      element: (
        <>
          <CreatePostComponent userData = {user}/>
        </>
      )
    },
    {
      path: "/post/:title",
      element: (
        <>
          <PostInfoComponent userData = {user}/>
        </>
      )
    },
    {
      path: "/edit-post/:postId",
      element: (
        <>
          <EditPostComponent userData = {user}/>
        </>
      )
    },
  ])

  return (
    <div>
      <HeaderComponent userData = {user} setUserData = {setUser}/>
      {loading ? (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: '100vh' }}
          >
            <h2 className="mb-3">Loading...</h2>
            <img src="https://i.gifer.com/ZZ5H.gif" alt="loading" />
          </div>
      ) : (
          element
      )}
      <FooterComponent/>
      <br/>
    </div>
  )
}

export default App
