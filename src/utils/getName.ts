interface dynamicObj {
  [key: string]: any;
}

interface user {
  name: string;
  value: string;
}

export function getNames(array: Array<dynamicObj>, name: string) {
  let res = new Array<user>();
  array.map((val) => {
    let bantu: any = new Object();
    bantu.value = val._id;
    if (name === val.user1.userName) {
      bantu.name = val.user2.userName;
    } else {
      bantu.name = val.user1.userName;
    }
    console.log(bantu);
    res = [...res, { ...bantu }];
  });

  console.log("kya re", res);
  return res;
}
