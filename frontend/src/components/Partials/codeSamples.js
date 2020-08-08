// filter salons by availability of category
// query all salons then filter those having hair category

data.salons.filter((salon) => !(salon.hairCategories === undefined || salon.hairCategories.length == 0))

// For example, if you want to remove null or undefined values and find number of valid values

var array = [0, 1, null, 2, "", 3, undefined, 3,,,,,, 4,, 4,, 5,, 6,,,,];

var filtered = array.filter(function (el) {
  return el !== null;
});

var filtered = array.filter(Boolean).length;

//pagination in pure react

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);
  <Pagination
        postsPerPage={postsPerPage}
        totalPosts={posts.length}
        paginate={paginate}
  />

import React from 'react';
const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className='page-item'>
            <a onClick={() => paginate(number)} href='!#' className='page-link'>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default Pagination;