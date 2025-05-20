function  Logout(){
    localStorage.removeItem('UserId'); 
    localStorage.removeItem('vendorId'); // Remove vendorId
    localStorage.removeItem('vendortoken'); // Remove vendorId
    window.location.href = '/login';
}
export default Logout;