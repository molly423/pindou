import { Pattern, Comment } from './types';

export const MOCK_PATTERNS: Pattern[] = [
  {
    id: '1',
    title: '虎斑猫大饼',
    author: 'PixelArtist99',
    authorAvatar: 'https://picsum.photos/seed/user1/100/100',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5J8a0jRBc_ORAhVVN9YH_gbOPGf_ZV2zPrDIOKrc84LjjGYo1tMaB4zuRruOSjwPwtbpB-AvEdAZVJJj9Xfa-kUUlmyUAQuPqmmfwVPpvGZiOBKxnPZKUqvr4g9hhX5dC2q5ZtNGpuBzetI0khLP205wuiewLUeABJxyMe_yDVOIrqA7FMhZxFSkrkjDLHTR9TZbRyEDRL_ASLqopBu_RyjB-zV6dOLgkxp6kdrMCwo1oSFUVep9aJrOeM3uM4WYNP7nyLr_wpWTG',
    likes: 1200,
    beadCount: 480,
    gridSize: '32x32',
    difficulty: 'Intermediate',
    publishedAt: '2 days ago',
    description: 'A cute 32x32 pixel art pattern of a curious tabby cat. Perfect for fridge magnets or keychains. This design uses standard Artkal S-series colors, but works great with Hama beads too!',
    colors: [
      { name: '黑色', code: 'S01', hex: '#222222', count: 124 },
      { name: '橙色', code: 'S12', hex: '#f48c25', count: 210 },
      { name: '白色', code: 'S02', hex: '#ffffff', count: 86 },
      { name: '粉色 (鼻子)', code: 'S34', hex: '#ffb7c5', count: 62 },
    ]
  },
  {
    id: '2',
    title: '超级水管工兄弟',
    author: 'PixelPro',
    authorAvatar: 'https://picsum.photos/seed/user2/100/100',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6KejK9yK8pxdJuh2yc8PUofWHQdyjG3zcQlmJlX4Ztf39jOBZGZa_dTwyFjRomXyKbvwHaDcU_ceUXsbwZ1Cyg_LxkzgTrbpTgX3NPgnwdHNXBMcy2JL_ALJsADVdCFWB2JhUySZMmitXYBo6FVmg95Z6MXA930f9JEKfeJmD1G6la-DJVHUqeyP6TBN7PkPyYg1qW4_1sRaPoYeZIt49Rgkp6_AsNeOGcmWai1r7yozHQb1z_vk5VF9F1fNAqUBj7_yDU4zwukor',
    likes: 1200,
    beadCount: 120,
    gridSize: '16x16',
    difficulty: 'Beginner',
    publishedAt: '1 week ago'
  },
  {
    id: '3',
    title: '夏日花束',
    author: 'BeadBloom',
    authorAvatar: 'https://picsum.photos/seed/user3/100/100',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWnfu1ZYZ_jTGBRnhDn7wBnKtZb4__7pWsym4v7EEmsqZ3xU2lIjBaJ43cQj_qu7DjqhCJXyjIhPF9n9Xfe-uVzjjIZ_H5n1WXEkT0M5muEbdFu6WHrIl6QqzaOJBz6e0g8Jp795WL3rBhb96-ej65o6NIUQT7IpH_C1Ng2fZn6eYZvsJ7i7Ld09TyHDDc5Xu1xeKYZ0zSpR29RHJexIM8UaOH3r4SPtH3ErT0CNQ2ObyIWS-AKMCQVzpRv7NZ1-o_52uoUqcKyxtd',
    likes: 842,
    gridSize: '24x24',
    difficulty: 'Advanced',
    publishedAt: '3 days ago'
  },
  {
    id: '4',
    title: 'Kawaii Fox Spirit',
    author: 'PixelMaster',
    authorAvatar: 'https://picsum.photos/seed/user4/100/100',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzmCuv9tVjnui9TADLmVZ34wZK-eXiDrjnzcaEbG9x8wKsmmL9BnEsx85MrfMlwUjWTMOTqX3hArIgaDXyL4gpdIxrvBY_U1BjcqOVy-QknxRXCgerPsmJkrzvGEHx1vFZE2MQ2fITc0cfkdIVyrz1-2AFx0Df9jZHQL9TvxwgzjbYWCTHnM8NMSkMNctEEW77yOBovMrYcVDB3GRvhlNhqfug1HTA3euJnryGIvCAeM3-H93wdmOYvM0SepWLJK9XnrNgJis6oj98',
    likes: 128,
    gridSize: '12x12',
    difficulty: 'Beginner',
    publishedAt: '5 hours ago'
  }
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    user: 'BeadMaster',
    avatar: 'https://picsum.photos/seed/c1/100/100',
    content: 'Just finished making this! It looks amazing on my fridge. Thanks for sharing the pattern.',
    time: '5 hours ago'
  },
  {
    id: 'c2',
    user: 'CraftyCat',
    avatar: 'https://picsum.photos/seed/c2/100/100',
    content: 'Could you do a Calico version next? Love your style!',
    time: '5 hours ago'
  }
];

export const PALETTE_COLORS = [
  { id: 'M-01', hex: '#f48c25' },
  { id: 'M-02', hex: '#ffffff' },
  { id: 'M-03', hex: '#000000' },
  { id: 'M-04', hex: '#3498db' },
  { id: 'M-05', hex: '#e74c3c' },
  { id: 'M-06', hex: '#2ecc71' },
  { id: 'M-07', hex: '#f1c40f' },
  { id: 'M-08', hex: '#9b59b6' },
  { id: 'M-09', hex: '#1abc9c' },
  { id: 'M-10', hex: '#34495e' },
];

export const MOCK_FOLLOWING = [
  { id: 'f1', name: 'PixelPro', avatar: 'https://picsum.photos/seed/user2/100/100', bio: 'Professional pixel artist' },
  { id: 'f2', name: 'BeadBloom', avatar: 'https://picsum.photos/seed/user3/100/100', bio: 'Nature inspired bead art' },
  { id: 'f3', name: 'CraftyCat', avatar: 'https://picsum.photos/seed/c2/100/100', bio: 'I love cats and beads!' },
  { id: 'f4', name: 'BeadMaster', avatar: 'https://picsum.photos/seed/c1/100/100', bio: 'Mastering the art of beads' },
];

export const MARD_COLORS_FULL = [
  // ZG 系列
  { id: 'ZG1', hex: '#DAABB3' }, { id: 'ZG2', hex: '#D6AA87' }, { id: 'ZG3', hex: '#C1BD8D' }, { id: 'ZG4', hex: '#96B69F' },
  { id: 'ZG5', hex: '#849DC6' }, { id: 'ZG6', hex: '#94BFE2' }, { id: 'ZG7', hex: '#E2A9D2' }, { id: 'ZG8', hex: '#AB91C0' },
  
  // A 系列
  { id: 'A1', hex: '#FAF4C8' }, { id: 'A2', hex: '#FFFFD5' }, { id: 'A3', hex: '#FEFF8B' }, { id: 'A4', hex: '#FBED56' },
  { id: 'A5', hex: '#F4D738' }, { id: 'A6', hex: '#FEAC4C' }, { id: 'A7', hex: '#FE8B4C' }, { id: 'A8', hex: '#FFDA45' },
  { id: 'A9', hex: '#FF995B' }, { id: 'A10', hex: '#F77C31' }, { id: 'A11', hex: '#FFDD99' }, { id: 'A12', hex: '#FE9F72' },
  { id: 'A13', hex: '#FFC365' }, { id: 'A14', hex: '#FD543D' }, { id: 'A15', hex: '#FFF365' }, { id: 'A16', hex: '#FFFF9F' },
  { id: 'A17', hex: '#FFE36E' }, { id: 'A18', hex: '#FEBE7D' }, { id: 'A19', hex: '#FD7C72' }, { id: 'A20', hex: '#FFD568' },
  { id: 'A21', hex: '#FFE395' }, { id: 'A22', hex: '#F4F57D' }, { id: 'A23', hex: '#E6C9B7' }, { id: 'A24', hex: '#F7F8A2' },
  { id: 'A25', hex: '#FFD67D' }, { id: 'A26', hex: '#FFC830' },

  // B 系列
  { id: 'B1', hex: '#E6EE31' }, { id: 'B2', hex: '#63F347' }, { id: 'B3', hex: '#9EF780' }, { id: 'B4', hex: '#5DE035' },
  { id: 'B5', hex: '#35E352' }, { id: 'B6', hex: '#65E2A6' }, { id: 'B7', hex: '#3DAF80' }, { id: 'B8', hex: '#1C9C4F' },
  { id: 'B9', hex: '#27523A' }, { id: 'B10', hex: '#95D3C2' }, { id: 'B11', hex: '#5D722A' }, { id: 'B12', hex: '#166F41' },
  { id: 'B13', hex: '#CAEB7B' }, { id: 'B14', hex: '#ADE946' }, { id: 'B15', hex: '#2E5132' }, { id: 'B16', hex: '#C5ED9C' },
  { id: 'B17', hex: '#9BB13A' }, { id: 'B18', hex: '#E6EE49' }, { id: 'B19', hex: '#24B88C' }, { id: 'B20', hex: '#C2F0CC' },
  { id: 'B21', hex: '#156A6B' }, { id: 'B22', hex: '#0B3C43' }, { id: 'B23', hex: '#303A21' }, { id: 'B24', hex: '#EEFCA5' },
  { id: 'B25', hex: '#4E846D' }, { id: 'B26', hex: '#8D7A35' }, { id: 'B27', hex: '#CCE1AF' }, { id: 'B28', hex: '#9EE5B9' },
  { id: 'B29', hex: '#C5E254' }, { id: 'B30', hex: '#E2FCB1' }, { id: 'B31', hex: '#B0E792' }, { id: 'B32', hex: '#9CAB5A' },

  // C 系列
  { id: 'C1', hex: '#E8FFE7' }, { id: 'C2', hex: '#A9F9FC' }, { id: 'C3', hex: '#A0E2FB' }, { id: 'C4', hex: '#41CCFF' },
  { id: 'C5', hex: '#01ACEB' }, { id: 'C6', hex: '#50AAF0' }, { id: 'C7', hex: '#3677D2' }, { id: 'C8', hex: '#0F54C0' },
  { id: 'C9', hex: '#324BCA' }, { id: 'C10', hex: '#3EBCE2' }, { id: 'C11', hex: '#28DDDE' }, { id: 'C12', hex: '#1C334D' },
  { id: 'C13', hex: '#CDE8FF' }, { id: 'C14', hex: '#D5FDFF' }, { id: 'C15', hex: '#22C4C6' }, { id: 'C16', hex: '#1557A8' },
  { id: 'C17', hex: '#04D1F6' }, { id: 'C18', hex: '#1D3344' }, { id: 'C19', hex: '#1887A2' }, { id: 'C20', hex: '#176DAF' },
  { id: 'C21', hex: '#BEDDFF' }, { id: 'C22', hex: '#67B4BE' }, { id: 'C23', hex: '#C8E2FF' }, { id: 'C24', hex: '#7CC4FF' },
  { id: 'C25', hex: '#A9E5E5' }, { id: 'C26', hex: '#3CAED8' }, { id: 'C27', hex: '#D3DFFA' }, { id: 'C28', hex: '#BBCFED' },
  { id: 'C29', hex: '#34488E' },

  // D 系列
  { id: 'D1', hex: '#AEB4F2' }, { id: 'D2', hex: '#858EDD' }, { id: 'D3', hex: '#2F54AF' }, { id: 'D4', hex: '#182A84' },
  { id: 'D5', hex: '#B843C5' }, { id: 'D6', hex: '#AC7BDE' }, { id: 'D7', hex: '#8854B3' }, { id: 'D8', hex: '#E2D3FF' },
  { id: 'D9', hex: '#D5B9F8' }, { id: 'D10', hex: '#361B51' }, { id: 'D11', hex: '#B9BAE1' }, { id: 'D12', hex: '#DE9AD4' },
  { id: 'D13', hex: '#B90095' }, { id: 'D14', hex: '#8B279B' }, { id: 'D15', hex: '#2F1F90' }, { id: 'D16', hex: '#E3E1EE' },
  { id: 'D17', hex: '#C4D4F6' }, { id: 'D18', hex: '#A45EC7' }, { id: 'D19', hex: '#D8C3D7' }, { id: 'D20', hex: '#9C32B2' },
  { id: 'D21', hex: '#9A009B' }, { id: 'D22', hex: '#333A95' }, { id: 'D23', hex: '#EBDAFC' }, { id: 'D24', hex: '#7786E5' },
  { id: 'D25', hex: '#494FC7' }, { id: 'D26', hex: '#DFC2F8' },

  // E 系列
  { id: 'E1', hex: '#FDD3CC' }, { id: 'E2', hex: '#FEC0DF' }, { id: 'E3', hex: '#FFB7E7' }, { id: 'E4', hex: '#E8649E' },
  { id: 'E5', hex: '#F551A2' }, { id: 'E6', hex: '#F13D74' }, { id: 'E7', hex: '#C63478' }, { id: 'E8', hex: '#FFDBE9' },
  { id: 'E9', hex: '#E970CC' }, { id: 'E10', hex: '#D33793' }, { id: 'E11', hex: '#FCDDD2' }, { id: 'E12', hex: '#F78FC3' },
  { id: 'E13', hex: '#B5006D' }, { id: 'E14', hex: '#FFD1BA' }, { id: 'E15', hex: '#F8C7C9' }, { id: 'E16', hex: '#FFF3EB' },
  { id: 'E17', hex: '#FFE2EA' }, { id: 'E18', hex: '#FFC7DB' }, { id: 'E19', hex: '#FEBAD5' }, { id: 'E20', hex: '#D8C7D1' },
  { id: 'E21', hex: '#BD9DA1' }, { id: 'E22', hex: '#B785A1' }, { id: 'E23', hex: '#937A8D' }, { id: 'E24', hex: '#E1BCE8' },

  // F 系列
  { id: 'F1', hex: '#FD957B' }, { id: 'F2', hex: '#FC3D46' }, { id: 'F3', hex: '#F74941' }, { id: 'F4', hex: '#FC283C' },
  { id: 'F5', hex: '#E7002F' }, { id: 'F6', hex: '#943630' }, { id: 'F7', hex: '#971937' }, { id: 'F8', hex: '#BC0028' },
  { id: 'F9', hex: '#E2677A' }, { id: 'F10', hex: '#8A4526' }, { id: 'F11', hex: '#5A2121' }, { id: 'F12', hex: '#FD4E6A' },
  { id: 'F13', hex: '#F35744' }, { id: 'F14', hex: '#FFA9AD' }, { id: 'F15', hex: '#D30022' }, { id: 'F16', hex: '#FEC2A6' },
  { id: 'F17', hex: '#E69C79' }, { id: 'F18', hex: '#D37C46' }, { id: 'F19', hex: '#C1444A' }, { id: 'F20', hex: '#CD9391' },
  { id: 'F21', hex: '#F7B4C6' }, { id: 'F22', hex: '#FDC0D0' }, { id: 'F23', hex: '#F67E66' }, { id: 'F24', hex: '#E698AA' },
  { id: 'F25', hex: '#E54B4F' },

  // G 系列
  { id: 'G1', hex: '#FFE2CE' }, { id: 'G2', hex: '#FFC4AA' }, { id: 'G3', hex: '#F4C3A5' }, { id: 'G4', hex: '#E1B383' },
  { id: 'G5', hex: '#EDB045' }, { id: 'G6', hex: '#E99C17' }, { id: 'G7', hex: '#9D5B3E' }, { id: 'G8', hex: '#753B32' },
  { id: 'G9', hex: '#E6B483' }, { id: 'G10', hex: '#D98C39' }, { id: 'G11', hex: '#E0C593' }, { id: 'G12', hex: '#FFC890' },
  { id: 'G13', hex: '#B7714A' }, { id: 'G14', hex: '#8D614C' }, { id: 'G15', hex: '#FCF9E0' }, { id: 'G16', hex: '#F2D9BA' },
  { id: 'G17', hex: '#7B524B' }, { id: 'G18', hex: '#FFE4CC' }, { id: 'G19', hex: '#E07935' }, { id: 'G20', hex: '#A94023' },
  { id: 'G21', hex: '#B88558' },

  // H 系列
  { id: 'H1', hex: '#FDFBFF' }, { id: 'H2', hex: '#FEFFFF' }, { id: 'H3', hex: '#B6B1BA' }, { id: 'H4', hex: '#89858C' },
  { id: 'H5', hex: '#48464E' }, { id: 'H6', hex: '#2F2B2F' }, { id: 'H7', hex: '#000000' }, { id: 'H8', hex: '#E7D6DB' },
  { id: 'H9', hex: '#EDEDED' }, { id: 'H10', hex: '#EEE9EA' }, { id: 'H11', hex: '#CECDD5' }, { id: 'H12', hex: '#FFF5ED' },
  { id: 'H13', hex: '#F5ECD2' }, { id: 'H14', hex: '#CFD7D3' }, { id: 'H15', hex: '#98A6A8' }, { id: 'H16', hex: '#1D1414' },
  { id: 'H17', hex: '#F1EDED' }, { id: 'H18', hex: '#FFFDF0' }, { id: 'H19', hex: '#F6EFE2' }, { id: 'H20', hex: '#949FA3' },
  { id: 'H21', hex: '#FFFBE1' }, { id: 'H22', hex: '#CACAD4' }, { id: 'H23', hex: '#9A9D94' },

  // M 系列
  { id: 'M1', hex: '#BCC6B8' }, { id: 'M2', hex: '#8AA386' }, { id: 'M3', hex: '#697D80' }, { id: 'M4', hex: '#E3D2BC' },
  { id: 'M5', hex: '#D0CCAA' }, { id: 'M6', hex: '#B0A782' }, { id: 'M7', hex: '#B4A497' }, { id: 'M8', hex: '#B38281' },
  { id: 'M9', hex: '#A58767' }, { id: 'M10', hex: '#C5B2BC' }, { id: 'M11', hex: '#9F7594' }, { id: 'M12', hex: '#644749' },
  { id: 'M13', hex: '#D19066' }, { id: 'M14', hex: '#C77362' }, { id: 'M15', hex: '#757D7B' },

  // P 系列
  { id: 'P1', hex: '#FCF7F8' }, { id: 'P2', hex: '#B0A9AC' }, { id: 'P3', hex: '#AFDCAB' }, { id: 'P4', hex: '#FEA49F' },
  { id: 'P5', hex: '#EE8C3E' }, { id: 'P6', hex: '#5FD0A7' }, { id: 'P7', hex: '#EB9270' }, { id: 'P8', hex: '#F0D958' },
  { id: 'P9', hex: '#D9D9D9' }, { id: 'P10', hex: '#D9C7EA' }, { id: 'P11', hex: '#F3ECC9' }, { id: 'P12', hex: '#E6EEF2' },
  { id: 'P13', hex: '#AACBEF' }, { id: 'P14', hex: '#3376B0' }, { id: 'P15', hex: '#668575' }, { id: 'P16', hex: '#FEBF45' },
  { id: 'P17', hex: '#FEA324' }, { id: 'P18', hex: '#FEB89F' }, { id: 'P19', hex: '#FFE0E9' }, { id: 'P20', hex: '#FEBECF' },
  { id: 'P21', hex: '#ECBEBF' }, { id: 'P22', hex: '#E4A89F' }, { id: 'P23', hex: '#A56268' },

  // Q 系列
  { id: 'Q1', hex: '#F2A5E8' }, { id: 'Q2', hex: '#E9EC91' }, { id: 'Q3', hex: '#FFFF00' }, { id: 'Q4', hex: '#FFEBFB' },
  { id: 'Q5', hex: '#76CEDE' },

  // R 系列
  { id: 'R1', hex: '#D50D21' }, { id: 'R2', hex: '#F92F83' }, { id: 'R3', hex: '#FD8324' }, { id: 'R4', hex: '#F8EC31' },
  { id: 'R5', hex: '#35C75B' }, { id: 'R6', hex: '#23B891' }, { id: 'R7', hex: '#19779D' }, { id: 'R8', hex: '#1A60C3' },
  { id: 'R9', hex: '#9A56B4' }, { id: 'R10', hex: '#FFDB4C' }, { id: 'R11', hex: '#FFEBFB' }, { id: 'R12', hex: '#D8D5CE' },
  { id: 'R13', hex: '#55514C' }, { id: 'R14', hex: '#9FE4DF' }, { id: 'R15', hex: '#77CEE9' }, { id: 'R16', hex: '#3ECFCA' },
  { id: 'R17', hex: '#4A867A' }, { id: 'R18', hex: '#7FCD9D' }, { id: 'R19', hex: '#CDE55D' }, { id: 'R20', hex: '#E8C7B4' },
  { id: 'R21', hex: '#AD6F3C' }, { id: 'R22', hex: '#6C372F' }, { id: 'R23', hex: '#FEB872' }, { id: 'R24', hex: '#F3C1C0' },
  { id: 'R25', hex: '#C9675E' }, { id: 'R26', hex: '#D293BE' }, { id: 'R27', hex: '#EA8CB1' }, { id: 'R28', hex: '#9C87D6' },

  // T 系列
  { id: 'T1', hex: '#FFFFFF' },

  // Y 系列
  { id: 'Y1', hex: '#FD6FB4' }, { id: 'Y2', hex: '#FEB481' }, { id: 'Y3', hex: '#D7FAA0' }, { id: 'Y4', hex: '#8BDBFA' },
  { id: 'Y5', hex: '#E987EA' },
];
